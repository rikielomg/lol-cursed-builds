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
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    /\.vercel\.app$/,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/players', playersRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/leaderboard', leaderboardRouter);

// DEBUG - remove later
app.get('/api/debug/matches/:playerId', async (req, res) => {
  try {
    const { getDb, dbGet } = require('./db/database');
    const { getMatchIds, getMatchDetails } = require('./riot/riotApi');
    await getDb();
    const player = dbGet('SELECT * FROM players WHERE id = ?', [req.params.playerId]);
    if (!player) return res.json({ error: 'player not found' });
    const matchIds = await getMatchIds(player.puuid, player.region, 10);
    const details = [];
    for (const id of (matchIds || []).slice(0, 3)) {
      const m = await getMatchDetails(id, player.region);
      const p = m.info.participants.find(x => x.puuid === player.puuid);
      details.push({ matchId: id, champion: p?.championName, win: p?.win, queueId: m.info.queueId });
    }
    res.json({ puuid: player.puuid, region: player.region, matchIds, details });
  } catch (e) {
    res.json({ error: e.message, stack: e.stack });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🎮 LoL Challenge API running on http://localhost:${PORT}`);
});

module.exports = app;
