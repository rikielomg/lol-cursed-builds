const express = require('express');
const router = express.Router();
const { getDb, dbGet, dbAll, dbRun } = require('../db/database');
const { generateBuild } = require('../db/gameData');
const { verifyChallenge } = require('../riot/riotApi');

router.post('/', async (req, res) => {
  try {
    const { player_id, role } = req.body;
    if (!player_id) return res.status(400).json({ error: 'player_id is required' });
    await getDb();
    const player = dbGet('SELECT * FROM players WHERE id = ?', [player_id]);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const active = dbGet("SELECT * FROM challenges WHERE player_id = ? AND status = 'active'", [player_id]);
    if (active) return res.status(400).json({
      error: 'You already have an active challenge.',
      challenge: parseChallenge(active),
    });

    const { champion, items, role: assignedRole } = generateBuild(role);

    const result = dbRun(
      `INSERT INTO challenges (player_id, champion, champion_range_type, champion_classes, items, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [player_id, champion.name, champion.rangeType, JSON.stringify(champion.classes), JSON.stringify(items), assignedRole]
    );
    const challenge = dbGet('SELECT * FROM challenges WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ challenge: parseChallenge(challenge) });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

router.get('/player/:playerId', async (req, res) => {
  await getDb();
  const challenges = dbAll('SELECT * FROM challenges WHERE player_id = ? ORDER BY created_at DESC', [req.params.playerId]);
  res.json({ challenges: challenges.map(parseChallenge) });
});

router.get('/:id', async (req, res) => {
  await getDb();
  const challenge = dbGet('SELECT * FROM challenges WHERE id = ?', [req.params.id]);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  res.json({ challenge: parseChallenge(challenge) });
});

router.post('/:id/verify', async (req, res) => {
  try {
    await getDb();
    const challenge = dbGet('SELECT * FROM challenges WHERE id = ?', [req.params.id]);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (challenge.status !== 'active') return res.status(400).json({ error: `Challenge is already ${challenge.status}` });

    const player = dbGet('SELECT * FROM players WHERE id = ?', [challenge.player_id]);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    if (!player.puuid) return res.status(400).json({ error: 'Player PUUID not found. Re-register with Riot ID (Name#TAG).' });

    const result = await verifyChallenge(player.puuid, player.region, challenge);

    if (result.verified || result.partialWin) {
      const scoreEarned = result.scoreEarned || 0;
      const newStatus = result.verified ? 'completed' : 'completed';

      dbRun("UPDATE challenges SET status = 'completed', match_id = ?, score_earned = ? WHERE id = ?",
        [result.matchId, scoreEarned, challenge.id]);
      dbRun("UPDATE players SET completed_builds = completed_builds + 1, score = score + ? WHERE id = ?",
        [scoreEarned, player.id]);

      const updatedChallenge = dbGet('SELECT * FROM challenges WHERE id = ?', [challenge.id]);
      const updatedPlayer = dbGet('SELECT * FROM players WHERE id = ?', [player.id]);

      return res.json({
        verified: true,
        message: result.message,
        scoreEarned,
        matchStats: { matchId: result.matchId, kills: result.kills, deaths: result.deaths, assists: result.assists, duration: result.gameDuration },
        challenge: parseChallenge(updatedChallenge),
        player: updatedPlayer,
      });
    }

    if (result.partialMatch) {
      dbRun('UPDATE players SET failed_attempts = failed_attempts + 1 WHERE id = ?', [player.id]);
    }
    return res.json({ verified: false, message: result.reason, challenge: parseChallenge(challenge) });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

router.delete('/:id/abandon', async (req, res) => {
  try {
    await getDb();
    const challenge = dbGet('SELECT * FROM challenges WHERE id = ?', [req.params.id]);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (challenge.status !== 'active') return res.status(400).json({ error: `Challenge is already ${challenge.status}` });
    dbRun("UPDATE challenges SET status = 'failed' WHERE id = ?", [challenge.id]);
    dbRun('UPDATE players SET failed_attempts = failed_attempts + 1 WHERE id = ?', [challenge.player_id]);
    res.json({ message: 'Challenge abandoned.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function parseChallenge(c) {
  return {
    ...c,
    items: JSON.parse(c.items),
    champion_classes: c.champion_classes ? JSON.parse(c.champion_classes) : [],
  };
}

module.exports = router;
