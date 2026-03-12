const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/challenges.db');
let db = null;

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  db = fs.existsSync(DB_PATH)
    ? new SQL.Database(fs.readFileSync(DB_PATH))
    : new SQL.Database();
  initSchema();
  setInterval(saveDb, 5000);
  process.on('exit', saveDb);
  process.on('SIGINT', () => { saveDb(); process.exit(); });
  return db;
}

function saveDb() {
  if (!db) return;
  try { fs.writeFileSync(DB_PATH, Buffer.from(db.export())); } catch (e) { console.error('DB save:', e.message); }
}

function initSchema() {
  db.run(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    summoner_name TEXT NOT NULL, puuid TEXT, region TEXT NOT NULL,
    completed_builds INTEGER DEFAULT 0, failed_attempts INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT, player_id INTEGER NOT NULL,
    champion TEXT NOT NULL, champion_range_type TEXT, champion_classes TEXT,
    items TEXT NOT NULL, role TEXT, status TEXT DEFAULT 'active',
    score_earned INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, match_id TEXT,
    FOREIGN KEY (player_id) REFERENCES players(id)
  )`);
}

function dbAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}
function dbGet(sql, params = []) { return dbAll(sql, params)[0] || null; }
function dbRun(sql, params = []) {
  db.run(sql, params);
  const r = dbAll('SELECT last_insert_rowid() as id');
  saveDb();
  return { lastInsertRowid: r[0]?.id };
}

module.exports = { getDb, dbAll, dbGet, dbRun };
