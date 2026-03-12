import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ChallengeCard from '../components/ChallengeCard';
import { getPlayer, generateChallenge, getPlayerChallenges, verifyChallenge, abandonChallenge } from '../lib/api';
import { loadSession, saveSession, clearSession } from '../lib/session';

const ROLES = [
  { value: 'top',     label: 'Top',     icon: '🛡' },
  { value: 'jungle',  label: 'Jungle',  icon: '🌿' },
  { value: 'mid',     label: 'Mid',     icon: '⚡' },
  { value: 'adc',     label: 'ADC',     icon: '🏹' },
  { value: 'support', label: 'Support', icon: '💫' },
];

export default function ChallengePage() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  // ── Resolve playerId from URL or localStorage session ──────
  useEffect(() => {
    if (!router.isReady) return;
    let id = router.query.playerId;
    if (!id) {
      const session = loadSession();
      if (session?.id) {
        id = session.id;
        router.replace(`/challenge?playerId=${id}`, undefined, { shallow: true });
      } else {
        router.replace('/');
        return;
      }
    }
    setPlayerId(id);
  }, [router.isReady, router.query.playerId]);

  useEffect(() => {
    if (playerId) loadData(playerId);
  }, [playerId]);

  async function loadData(id) {
    setLoading(true);
    try {
      const [playerData, challengesData] = await Promise.all([
        getPlayer(id),
        getPlayerChallenges(id),
      ]);
      setPlayer(playerData.player);
      saveSession(playerData.player); // keep session fresh
      const all = challengesData.challenges;
      setChallenge(all.find(c => c.status === 'active') || null);
      setHistory(all.filter(c => c.status !== 'active').slice(0, 6));
    } catch (err) {
      console.error(err);
      // If player not found, clear session and go home
      clearSession();
      router.replace('/');
    } finally { setLoading(false); }
  }

  async function handleGenerate() {
    setIsGenerating(true); setMessage(null);
    try {
      const data = await generateChallenge(playerId, selectedRole || undefined);
      setChallenge(data.challenge);
      setMessage({ type: 'success', text: `🎲 New cursed build generated for ${data.challenge.role?.toUpperCase()}! Time to suffer.` });
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to generate challenge';
      if (err.response?.data?.challenge) setChallenge(err.response.data.challenge);
      setMessage({ type: 'error', text: errMsg });
    } finally { setIsGenerating(false); }
  }

  async function handleVerify() {
    if (!challenge) return;
    setIsVerifying(true); setMessage(null);
    try {
      const data = await verifyChallenge(challenge.id);
      if (data.verified) {
        setMessage({ type: 'success', text: data.message });
        setChallenge(null);
        setHistory(prev => [data.challenge, ...prev.slice(0, 5)]);
        setPlayer(data.player);
        saveSession(data.player);
      } else {
        setMessage({ type: 'info', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Verification failed' });
    } finally { setIsVerifying(false); }
  }

  async function handleAbandon() {
    if (!challenge || !confirm('Abandon this challenge? This counts as a failed attempt.')) return;
    try {
      await abandonChallenge(challenge.id);
      setHistory(prev => [{ ...challenge, status: 'failed' }, ...prev.slice(0, 5)]);
      setChallenge(null);
      setMessage({ type: 'info', text: 'Challenge abandoned. Generate a new one when ready.' });
      const playerData = await getPlayer(playerId);
      setPlayer(playerData.player);
      saveSession(playerData.player);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to abandon challenge' });
    }
  }

  function handleLogout() {
    clearSession();
    router.replace('/');
  }

  if (loading) {
    return (
      <Layout title="Challenge — Cursed Builds">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontFamily: 'Cinzel, serif', color: '#785a28', letterSpacing: '0.2em', fontSize: '0.85rem' }} className="animate-pulse-gold">
            LOADING CHALLENGE...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Challenge — Cursed Builds">
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Player stats bar */}
        {player && (
          <div className="lol-panel" style={{ padding: '16px 24px', marginBottom: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderRadius: '2px' }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px' }}>Summoner</div>
              <div style={{ fontFamily: 'Cinzel, serif', color: '#f0e6a0', fontSize: '1rem', fontWeight: 700 }}>{player.summoner_name}</div>
              <div style={{ fontSize: '0.65rem', color: '#5a7a99' }}>{player.region}</div>
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.6rem', color: '#1cae74', fontWeight: 700, lineHeight: 1 }}>{player.completed_builds}</div>
                <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px' }}>Wins</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.6rem', color: '#c33c3c', fontWeight: 700, lineHeight: 1 }}>{player.failed_attempts}</div>
                <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px' }}>Failed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.6rem', color: '#c89b3c', fontWeight: 700, lineHeight: 1 }}>{player.score}</div>
                <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px' }}>Score</div>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #1a2a3a', color: '#3a4f6a', fontSize: '0.65rem', padding: '6px 12px', cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', borderRadius: '2px' }}
                onMouseEnter={e => e.target.style.borderColor = '#785a28'}
                onMouseLeave={e => e.target.style.borderColor = '#1a2a3a'}>
                LOGOUT
              </button>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div style={{ padding: '14px 18px', marginBottom: '24px', borderRadius: '2px', fontSize: '0.85rem', lineHeight: 1.5,
            ...(message.type === 'success' ? { background: 'rgba(28,174,116,0.1)', border: '1px solid #1cae74', color: '#60d4a0' }
              : message.type === 'error' ? { background: 'rgba(195,60,60,0.1)', border: '1px solid #c33c3c', color: '#e07070' }
              : { background: 'rgba(11,196,227,0.1)', border: '1px solid #0bc4e3', color: '#60d4f0' }) }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: challenge ? '1fr 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>

          {/* Active challenge or generate prompt */}
          <div>
            {challenge ? (
              <>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: '#785a28', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Active Challenge
                </div>
                <ChallengeCard challenge={challenge} onVerify={handleVerify} onAbandon={handleAbandon} isVerifying={isVerifying} />
                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(11,196,227,0.05)', border: '1px solid rgba(11,196,227,0.15)', borderRadius: '2px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#5a7a99', lineHeight: 1.8 }}>
                    <div style={{ color: '#0bc4e3', fontFamily: 'Cinzel, serif', fontSize: '0.65rem', letterSpacing: '0.15em', marginBottom: '8px' }}>HOW TO COMPLETE</div>
                    1. Play a <strong style={{ color: '#a0b4c8' }}>ranked game</strong> as {challenge.champion}<br />
                    2. Buy as many of the <strong style={{ color: '#a0b4c8' }}>6 items</strong> as possible<br />
                    3. Each item = <strong style={{ color: '#c89b3c' }}>+10 pts</strong> · Win = <strong style={{ color: '#c89b3c' }}>+40 pts bonus</strong><br />
                    4. Click <strong style={{ color: '#c89b3c' }}>Verify Match</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="lol-panel corner-decor" style={{ padding: '48px 32px', textAlign: 'center', borderRadius: '2px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🎲</div>
                <h2 style={{ fontFamily: 'Cinzel, serif', color: '#785a28', fontSize: '1rem', letterSpacing: '0.15em', marginBottom: '12px' }}>No Active Challenge</h2>
                <p style={{ fontSize: '0.8rem', color: '#5a7a99', marginBottom: '24px', lineHeight: 1.7 }}>
                  Choose a role (or leave random) and generate your cursed build.
                </p>

                {/* Role picker */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <button onClick={() => setSelectedRole('')}
                    style={{ padding: '6px 14px', borderRadius: '2px', fontSize: '0.7rem', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', cursor: 'pointer', background: selectedRole === '' ? 'rgba(200,155,60,0.2)' : 'transparent', border: `1px solid ${selectedRole === '' ? '#c89b3c' : '#2a3a5a'}`, color: selectedRole === '' ? '#c89b3c' : '#5a7a99' }}>
                    🎲 Random
                  </button>
                  {ROLES.map(r => (
                    <button key={r.value} onClick={() => setSelectedRole(r.value)}
                      style={{ padding: '6px 14px', borderRadius: '2px', fontSize: '0.7rem', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', cursor: 'pointer', background: selectedRole === r.value ? 'rgba(200,155,60,0.2)' : 'transparent', border: `1px solid ${selectedRole === r.value ? '#c89b3c' : '#2a3a5a'}`, color: selectedRole === r.value ? '#c89b3c' : '#5a7a99' }}>
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>

                <button onClick={handleGenerate} disabled={isGenerating} className="btn-gold" style={{ padding: '12px 32px', fontSize: '0.85rem', borderRadius: '2px' }}>
                  {isGenerating ? 'Generating...' : '⚔ Generate Cursed Build'}
                </button>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: '#785a28', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                History
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map(c => (
                  <div key={c.id} className="lol-panel" style={{ padding: '12px 16px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: '#f0e6a0', marginBottom: '2px' }}>{c.champion}</div>
                      <div style={{ fontSize: '0.6rem', color: '#5a7a99' }}>
                        {c.role?.toUpperCase()} · {c.items.slice(0, 3).map(i => i.name).join(' · ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={c.status === 'completed' ? 'badge-completed' : 'badge-failed'}
                            style={{ padding: '3px 10px', fontSize: '0.6rem', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', borderRadius: '2px' }}>
                        {c.status === 'completed' ? 'WIN' : 'FAIL'}
                      </span>
                      {c.score_earned > 0 && (
                        <div style={{ fontSize: '0.7rem', color: '#c89b3c', fontFamily: 'Cinzel, serif', marginTop: '4px' }}>+{c.score_earned} pts</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
