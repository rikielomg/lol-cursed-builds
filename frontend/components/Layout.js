import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Layout({ children, title = 'Cursed Builds — LoL Challenge' }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generate cursed League of Legends builds and prove you can win with them." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col hex-bg" style={{ background: '#010a13' }}>
        {/* Top bar */}
        <div style={{ borderBottom: '1px solid #1a2a3a', background: 'rgba(5,10,20,0.95)' }}
             className="sticky top-0 z-50 backdrop-blur-sm">
          {/* Gold accent line */}
          <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, #785a28, #c89b3c, #785a28, transparent)' }} />

          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div style={{
                  width: '36px', height: '36px',
                  background: 'linear-gradient(135deg, #785a28, #c89b3c)',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  ⚔
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', color: '#c89b3c', letterSpacing: '0.12em', fontWeight: 700 }}>
                  CURSED BUILDS
                </div>
                <div style={{ fontSize: '0.6rem', color: '#5a7a99', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  LoL Challenge Platform
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/" className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
              <Link href="/challenge" className={`nav-link ${router.pathname === '/challenge' ? 'active' : ''}`}>
                Challenge
              </Link>
              <Link href="/leaderboard" className={`nav-link ${router.pathname === '/leaderboard' ? 'active' : ''}`}>
                Leaderboard
              </Link>
            </div>
          </nav>
        </div>

        {/* Main */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #1a2a3a', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#2a4060', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Cursed Builds is not endorsed by Riot Games · Use of Riot Games API
          </div>
        </footer>
      </div>
    </>
  );
}
