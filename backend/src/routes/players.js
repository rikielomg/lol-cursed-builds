const express = require('express');
const router = express.Router();
const { getDb, dbGet, dbRun } = require('../db/database');
const { getPuuidByRiotId } = require('../riot/riotApi');

router.post('/', async (req, res) => {
  try {
    const { summoner_name, region } = req.body;
    if (!summoner_name || !region)
      return res.status(400).json({ error: 'summoner_name and region are required' });

    await getDb();
    let player = dbGet('SELECT * FROM players WHERE summoner_name = ? AND region = ?',
      [summoner_name.trim(), region.toUpperCase()]);
    if (player) return res.json({ player, existing: true });

    let puuid = null, resolvedName = summoner_name.trim();
    try {
      const tagMap = { EUW:'EUW', EUNE:'EUNE', NA:'NA', KR:'KR', BR:'BR', LA1:'LAN', LA2:'LAS', TR:'TR', JP:'JP', OC1:'OCE' };
      let gameName = summoner_name.trim(), tagLine;
      if (summoner_name.includes('#')) {
        [gameName, tagLine] = summoner_name.split('#');
      } else {
        tagLine = tagMap[region.toUpperCase()] || region.toUpperCase();
      }
      const accountData = await getPuuidByRiotId(gameName.trim(), tagLine.trim(), region);
      puuid = accountData.puuid;
      resolvedName = `${accountData.gameName}#${accountData.tagLine}`;
    } catch (riotErr) {
      console.warn('Riot API error:', riotErr.message);
      if (process.env.REQUIRE_RIOT_API === 'true')
        return res.status(404).json({ error: 'Summoner not found. Use format: Name#TAG' });
    }

    const result = dbRun('INSERT INTO players (summoner_name, puuid, region) VALUES (?, ?, ?)',
      [resolvedName, puuid, region.toUpperCase()]);
    player = dbGet('SELECT * FROM players WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ player, existing: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  await getDb();
  const player = dbGet('SELECT * FROM players WHERE id = ?', [req.params.id]);
  if (!player) return res.status(404).json({ error: 'Player not found' });
  res.json({ player });
});

module.exports = router;
