import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { registerPlayer } from '../lib/api';
import { saveSession, loadSession } from '../lib/session';

const REGIONS = ['EUW', 'EUNE', 'NA', 'KR', 'BR', 'LA1', 'LA2', 'TR', 'JP', 'OC1'];

export default function Home() {
  const router = useRouter();
  const [summonerName, setSummonerName] = useState('');
  const [region, setRegion] = useState('EUW');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    const session = loadSession();
    if (session?.id) {
      router.replace(`/challenge?playerId=${session.id}`);
    }
  }, []);

  async function handleSubmit() {
    if (!summonerName.trim()) { setError('Please enter your Riot ID (Name#TAG)'); return; }
    setLoading(true); setError('');
    try {
      const data = await registerPlayer(summonerName.trim(), region);
      saveSession(data.player);
      router.push(`/challenge?playerId=${data.player.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to look up player. Try again.');
    } finally { setLoading(false); }
  }

  return (
    <Layout title="Cursed Builds — LoL Challenge Platform">
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,155,60,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(11,196,227,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, #785a28)' }} />

        <div style={{ textAlign: 'center', maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '28px', display: 'inline-block' }}>
            <div style={{ width: '72px', height: '72px', margin: '0 auto', background: 'linear-gradient(135deg, #785a28, #c89b3c)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: '0 0 40px rgba(200,155,60,0.3)' }}>⚔</div>
          </div>

          <h1 className="text-glow-gold" style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: '8px', color: '#f0e6a0' }}>
            CURSED BUILDS
          </h1>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', letterSpacing: '0.3em', color: '#785a28', textTransform: 'uppercase', marginBottom: '28px' }}>
            League of Legends Challenge Platform
          </div>

          <div className="divider-gold" style={{ maxWidth: '300px', margin: '0 auto 32px' }} />

          <p style={{ fontSize: '1rem', color: '#7090a8', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 48px' }}>
            Generate a <span style={{ color: '#c89b3c' }}>randomized cursed build</span> for a random role, prove you can win with it in a ranked game, and claim your place on the leaderboard.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '56px', maxWidth: '640px', margin: '0 auto 56px' }}>
            {[
              { step: '01', label: 'Generate', desc: 'Get a random champion, role & cursed 6-item build' },
              { step: '02', label: 'Play', desc: 'Earn points for each correct item, +40 for the win' },
              { step: '03', label: 'Conquer', desc: 'Verify your game and claim leaderboard glory' },
            ].map(s => (
              <div key={s.step} className="lol-panel" style={{ padding: '20px 16px', textAlign: 'center', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#785a28', marginBottom: '4px', fontWeight: 700 }}>{s.step}</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', color: '#c89b3c', letterSpacing: '0.1em', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#5a7a99', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="lol-panel corner-decor" style={{ padding: '32px', maxWidth: '440px', margin: '0 auto', borderRadius: '2px' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', letterSpacing: '0.15em', color: '#785a28', textTransform: 'uppercase', marginBottom: '20px' }}>
              Enter Your Summoner
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: '#5a7a99', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Riot ID (Name#TAG)</label>
                <input type="text" placeholder="e.g. Faker#KR1" value={summonerName}
                  onChange={e => setSummonerName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="lol-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '2px', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: '#5a7a99', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Region</label>
                <select value={region} onChange={e => setRegion(e.target.value)}
                  className="lol-select" style={{ width: '100%', padding: '10px 14px', borderRadius: '2px', fontSize: '0.9rem' }}>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(195,60,60,0.1)', border: '1px solid #c33c3c', color: '#e07070', padding: '10px 14px', borderRadius: '2px', fontSize: '0.8rem', marginBottom: '16px', lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ width: '100%', padding: '13px', fontSize: '0.85rem', borderRadius: '2px' }}>
              {loading ? 'Summoning...' : '⚔ Generate My Challenge'}
            </button>

            <div style={{ fontSize: '0.65rem', color: '#3a4f6a', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>
              Requires Riot API key for PUUID lookup · Works in dev mode without it
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
