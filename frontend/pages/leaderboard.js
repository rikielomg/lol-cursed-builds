import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getLeaderboard } from '../lib/api';

function RankIcon({ rank }) {
  if (rank === 1) return <span style={{ fontSize: '1.2rem' }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: '1.2rem' }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: '1.2rem' }}>🥉</span>;
  return (
    <span style={{
      fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: '#3a5a7a',
      width: '28px', textAlign: 'center', display: 'inline-block'
    }}>
      {rank}
    </span>
  );
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data.leaderboard);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Leaderboard — Cursed Builds">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: '#785a28', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Hall of Cursed Champions
          </div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#f0e6a0', fontWeight: 900, letterSpacing: '0.05em', textShadow: '0 0 30px rgba(200, 155, 60, 0.3)', marginBottom: '8px' }}>
            LEADERBOARD
          </h1>
          <div className="divider-gold" style={{ maxWidth: '200px', margin: '0 auto 16px' }} />
          {lastUpdated && (
            <div style={{ fontSize: '0.65rem', color: '#3a4f6a', letterSpacing: '0.1em' }}>
              Updated {lastUpdated.toLocaleTimeString()}
              <button onClick={loadLeaderboard} style={{ marginLeft: '12px', color: '#785a28', fontSize: '0.65rem', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}>
                ↻ Refresh
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontFamily: 'Cinzel, serif', color: '#785a28', letterSpacing: '0.2em', fontSize: '0.85rem' }} className="animate-pulse-gold">
              LOADING...
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="lol-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '2px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>⚔</div>
            <div style={{ fontFamily: 'Cinzel, serif', color: '#785a28', fontSize: '0.85rem', letterSpacing: '0.15em' }}>
              No challengers yet. Be the first!
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {leaderboard.length >= 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: '12px', marginBottom: '24px', alignItems: 'end' }}>
                {/* 2nd place */}
                <div className="lol-panel" style={{ padding: '20px 16px', textAlign: 'center', borderRadius: '2px', opacity: 0.9 }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🥈</div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', color: '#c0c0c0', fontWeight: 700, marginBottom: '4px' }}>
                    {leaderboard[1].summoner_name.split('#')[0]}
                  </div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#c0c0c0', fontWeight: 900 }}>
                    {leaderboard[1].score}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.1em', textTransform: 'uppercase' }}>pts</div>
                </div>

                {/* 1st place */}
                <div style={{ background: 'linear-gradient(180deg, rgba(200,155,60,0.15) 0%, rgba(9,14,28,1) 100%)', border: '1px solid #c89b3c', padding: '24px 16px', textAlign: 'center', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, #c89b3c, transparent)' }} />
                  <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🥇</div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', color: '#f0e6a0', fontWeight: 700, marginBottom: '4px', textShadow: '0 0 15px rgba(200, 155, 60, 0.4)' }}>
                    {leaderboard[0].summoner_name.split('#')[0]}
                  </div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.8rem', color: '#c89b3c', fontWeight: 900, textShadow: '0 0 20px rgba(200, 155, 60, 0.5)' }}>
                    {leaderboard[0].score}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#785a28', letterSpacing: '0.1em', textTransform: 'uppercase' }}>pts</div>
                </div>

                {/* 3rd place */}
                <div className="lol-panel" style={{ padding: '20px 16px', textAlign: 'center', borderRadius: '2px', opacity: 0.9 }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🥉</div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', color: '#cd7f32', fontWeight: 700, marginBottom: '4px' }}>
                    {leaderboard[2].summoner_name.split('#')[0]}
                  </div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#cd7f32', fontWeight: 900 }}>
                    {leaderboard[2].score}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.1em', textTransform: 'uppercase' }}>pts</div>
                </div>
              </div>
            )}

            {/* Full table */}
            <div className="lol-panel" style={{ borderRadius: '2px', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 80px 80px',
                padding: '12px 20px',
                borderBottom: '1px solid #1a2a3a',
                background: 'rgba(0,0,0,0.3)',
              }}>
                {['#', 'Summoner', 'Region', 'Wins', 'Failed', 'Score'].map(col => (
                  <div key={col} style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#785a28', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: col !== 'Summoner' ? 'center' : 'left' }}>
                    {col}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {leaderboard.map((player, idx) => (
                <div
                  key={player.id}
                  style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 80px 80px',
                    padding: '14px 20px',
                    borderBottom: idx < leaderboard.length - 1 ? '1px solid rgba(26,42,58,0.6)' : 'none',
                    background: idx === 0 ? 'rgba(200, 155, 60, 0.04)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(200, 155, 60, 0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = idx === 0 ? 'rgba(200, 155, 60, 0.04)' : 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RankIcon rank={idx + 1} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: idx < 3 ? '#f0e6a0' : '#a0b4c8', fontWeight: idx < 3 ? 700 : 400 }}>
                        {player.summoner_name.split('#')[0]}
                      </div>
                      {player.summoner_name.includes('#') && (
                        <div style={{ fontSize: '0.6rem', color: '#3a4f6a' }}>
                          #{player.summoner_name.split('#')[1]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#5a7a99' }}>
                    {player.region}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cinzel, serif', fontSize: '0.9rem', color: '#1cae74', fontWeight: 700 }}>
                    {player.completed_builds}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cinzel, serif', fontSize: '0.9rem', color: '#c33c3c', fontWeight: 700 }}>
                    {player.failed_attempts}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', color: idx < 3 ? '#c89b3c' : '#785a28', fontWeight: 700 }}>
                      {player.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.65rem', color: '#2a3a4a', letterSpacing: '0.1em' }}>
              Score = completed wins × 10 · Top 50 players shown
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
