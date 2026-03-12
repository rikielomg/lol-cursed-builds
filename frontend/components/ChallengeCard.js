const DDRAGON = 'https://ddragon.leagueoflegends.com/cdn/14.24.1';
const ITEM_CDN = 'https://static.bigbrain.gg/assets/lol/riot_static/16.5.1/img/item';

const CHAMP_KEY_MAP = {
  "Nunu & Willump": "Nunu", "Dr. Mundo": "DrMundo", "Aurelion Sol": "AurelionSol",
  "Bel'Veth": "Belveth", "Cho'Gath": "Chogath", "Kai'Sa": "Kaisa", "Kha'Zix": "Khazix",
  "Kog'Maw": "KogMaw", "Lee Sin": "LeeSin", "Master Yi": "MasterYi", "Miss Fortune": "MissFortune",
  "Rek'Sai": "RekSai", "Tahm Kench": "TahmKench", "Twisted Fate": "TwistedFate",
  "Vel'Koz": "Velkoz", "Wukong": "MonkeyKing", "Xin Zhao": "XinZhao", "Jarvan IV": "JarvanIV",
};

function getChampKey(name) {
  return CHAMP_KEY_MAP[name] || name.replace(/[^a-zA-Z]/g, '');
}

const ROLE_ICONS = { top: '🛡', jungle: '🌿', mid: '⚡', adc: '🏹', support: '💫' };
const ROLE_LABELS = { top: 'Top', jungle: 'Jungle', mid: 'Mid', adc: 'ADC', support: 'Support' };

const STATUS_CONFIG = {
  active:    { label: 'ACTIVE',     className: 'badge-active' },
  completed: { label: 'COMPLETED',  className: 'badge-completed' },
  failed:    { label: 'ABANDONED',  className: 'badge-failed' },
};

export default function ChallengeCard({ challenge, onVerify, onAbandon, isVerifying }) {
  const { champion, champion_range_type, champion_classes, items, status, role, score_earned } = challenge;
  const champKey = getChampKey(champion);
  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  return (
    <div className="lol-panel corner-decor relative p-6 fade-in-up" style={{ maxWidth: '500px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {role && (
            <span style={{ background: 'rgba(200,155,60,0.1)', border: '1px solid #785a28', padding: '2px 10px', fontSize: '0.65rem', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', borderRadius: '2px', color: '#c89b3c' }}>
              {ROLE_ICONS[role]} {ROLE_LABELS[role]}
            </span>
          )}
        </div>
        <span className={`${statusConf.className} px-3 py-1 text-xs font-bold`}
              style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', borderRadius: '2px' }}>
          {statusConf.label}
        </span>
      </div>

      <div className="divider-gold" />

      {/* Champion */}
      <div className="flex items-center gap-4 mb-5">
        <div style={{
          width: '72px', height: '72px', border: '2px solid #785a28', borderRadius: '4px',
          overflow: 'hidden', flexShrink: 0, background: '#050e1e',
          boxShadow: '0 0 20px rgba(200, 155, 60, 0.2)',
        }}>
          <img
            src={`${DDRAGON}/img/champion/${champKey}.png`}
            alt={champion} width={72} height={72}
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champKey}.png`; }}
          />
        </div>
        <div>
          <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px' }}>Champion</div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', color: '#f0e6a0', fontWeight: 700, textShadow: '0 0 15px rgba(200, 155, 60, 0.4)' }}>
            {champion}
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
            {champion_range_type && (
              <span style={{ fontSize: '0.6rem', color: '#3a5a7a', border: '1px solid #1a3a5a', padding: '1px 6px', borderRadius: '2px' }}>
                {champion_range_type}
              </span>
            )}
            {(champion_classes || []).map(cls => (
              <span key={cls} style={{ fontSize: '0.6rem', color: '#5a7a99', border: '1px solid #1a2a3a', padding: '1px 6px', borderRadius: '2px' }}>
                {cls}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Build */}
      <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Build — {items.length} Items
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {items.map((item, idx) => (
          <div key={idx} className="item-slot"
               style={{ borderRadius: '3px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0a1428, #050e1e)', border: '1px solid #2a3a5a', borderRadius: '3px', flexShrink: 0, overflow: 'hidden' }}>
              <img
                src={`${ITEM_CDN}/${item.id}.png`}
                alt={item.name} width={32} height={32}
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
            <span style={{ fontSize: '0.68rem', color: '#a0b4c8', lineHeight: 1.2 }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Scoring reminder */}
      {status === 'active' && (
        <div style={{ background: 'rgba(200,155,60,0.05)', border: '1px solid rgba(120,90,40,0.4)', borderRadius: '2px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.7rem', color: '#5a7a99', lineHeight: 1.7 }}>
          <span style={{ color: '#c89b3c' }}>Scoring: </span>
          +10 pts per correct item · +40 pts bonus if you win
        </div>
      )}

      <div className="divider-gold" />

      {/* Completed score */}
      {status === 'completed' && score_earned != null && (
        <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
          <div style={{ fontFamily: 'Cinzel, serif', color: '#1cae74', fontSize: '0.85rem', letterSpacing: '0.1em' }}>✓ Completed</div>
          <div style={{ fontFamily: 'Cinzel, serif', color: '#c89b3c', fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>
            +{score_earned} pts
          </div>
        </div>
      )}

      {/* Actions */}
      {status === 'active' && (
        <div className="flex gap-3 mt-4">
          <button onClick={onVerify} disabled={isVerifying} className="btn-gold flex-1 py-3 px-4 text-sm" style={{ borderRadius: '2px' }}>
            {isVerifying ? <span className="animate-pulse-gold">Checking...</span> : '⚔ Verify Match'}
          </button>
          <button onClick={onAbandon} disabled={isVerifying} className="btn-outline py-3 px-4 text-xs" style={{ borderRadius: '2px' }}>
            Abandon
          </button>
        </div>
      )}

      {status === 'failed' && (
        <div style={{ textAlign: 'center', padding: '12px 0 4px', fontFamily: 'Cinzel, serif', color: '#c33c3c', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
          ✗ Abandoned
        </div>
      )}
    </div>
  );
}
