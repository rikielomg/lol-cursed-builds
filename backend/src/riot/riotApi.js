require('dotenv').config();
const express = require('express');
const cors = require('cors');

const playersRouter = require('./routes/players');
const challengesRouter = require('./routes/challenges');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
    ].filter(Boolean);
    // Allow all vercel.app preview domains + no-origin requests (Postman etc)
    if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origin not allowed: ' + origin));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Debug endpoint - remove in production
app.get('/api/debug/matches/:playerId', async (req, res) => {
  try {
    const { getDb, dbGet } = require('./db/database');
    await getDb();
    const player = dbGet('SELECT * FROM players WHERE id = ?', [req.params.playerId]);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const { getMatchIds, getMatchDetails } = require('./riot/riotApi');
    const matchIds = await getMatchIds(player.puuid, player.region, 10);

    const matches = [];
    for (const matchId of matchIds.slice(0, 3)) {
      const data = await getMatchDetails(matchId, player.region);
      const p = data.info.participants.find(p => p.puuid === player.puuid);
      if (p) matches.push({
        matchId,
        champion: p.championName,
        win: p.win,
        items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5],
        queueId: data.info.queueId,
        gameMode: data.info.gameMode,
      });
    }

    res.json({ player: { id: player.id, name: player.summoner_name, puuid: player.puuid }, matchIds, matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/players', playersRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/leaderboard', leaderboardRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🎮 LoL Challenge API running on http://localhost:${PORT}`);
});

module.exports = app;
