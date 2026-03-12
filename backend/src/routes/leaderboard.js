const express = require('express');
const router = express.Router();
const { getDb, dbAll } = require('../db/database');

router.get('/', async (req, res) => {
  await getDb();
  const players = dbAll(`
    SELECT p.id, p.summoner_name, p.region, p.completed_builds, p.failed_attempts, p.score, p.created_at
    FROM players p
    ORDER BY p.score DESC, p.completed_builds DESC
    LIMIT 50
  `);
  res.json({ leaderboard: players });
});

module.exports = router;
