import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sonrisapp — Agenda Inteligente para Odontólogos',
  description: 'Sonrisapp: Sistema de gestión odontológica profesional. Agenda digital, odontograma interactivo, notificaciones automáticas. Probá 1 mes gratis.',
}

const landingCSS = `
html { scroll-behavior: smooth; }

#landing-root {
  --ink: #080d18;
  --deep: #0d1526;
  --surface: #0f1a2a;
  --card: #13202f;
  --card-hover: #172435;
  --border: rgba(255,255,255,0.06);
  --border-accent: rgba(34,211,238,0.18);
  --cyan: #22d3ee;
  --cyan-soft: rgba(34,211,238,0.1);
  --cyan-glow: rgba(34,211,238,0.22);
  --white: #eef2f7;
  --muted: rgba(238,242,247,0.42);
  --muted2: rgba(238,242,247,0.25);
  --gold: #c9a84c;
  --red: #f87171;
  --green: #34d399;
  font-family: var(--font-dm-sans, 'DM Sans'), sans-serif;
  background: var(--ink);
  color: var(--white);
  overflow-x: hidden;
  line-height: 1.6;
  position: relative;
  min-height: 100vh;
}

#landing-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* ─── NAV ─── */
#landing-root nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 1.2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(8,13,24,0.8);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
}

#landing-root .nav-logo {
  font-family: var(--font-dm-sans, 'DM Sans'), sans-serif;
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--white);
  text-decoration: none;
}
#landing-root .nav-logo span { color: var(--cyan); font-weight: 300; font-style: italic; }

#landing-root .nav-right { display: flex; align-items: center; gap: 2rem; }

#landing-root .nav-link {
  color: var(--muted);
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.2s;
}
#landing-root .nav-link:hover { color: var(--white); }

#landing-root .nav-cta {
  background: var(--cyan);
  color: var(--ink);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.6rem 1.5rem;
  border-radius: 100px;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
}
#landing-root .nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

#landing-root .nav-ingresar {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s;
}
#landing-root .nav-ingresar:hover { color: var(--white); }

/* ─── HERO ─── */
#landing-root .hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 9rem 2rem 6rem;
  position: relative;
  overflow: hidden;
}

#landing-root .hero-glow {
  position: absolute;
  top: 40%; left: 50%;
  transform: translate(-50%, -50%);
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%);
  pointer-events: none;
}

#landing-root .hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-accent);
  background: var(--cyan-soft);
  color: var(--cyan);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.45rem 1.1rem;
  border-radius: 100px;
  margin-bottom: 2.5rem;
  animation: fadeUp 0.8s ease both;
}

#landing-root .hero-title {
  font-family: var(--font-cormorant, 'Cormorant Garamond'), serif;
  font-size: clamp(3.8rem, 9vw, 7.5rem);
  font-weight: 300;
  line-height: 1.04;
  letter-spacing: -0.02em;
  margin-bottom: 1.8rem;
  animation: fadeUp 0.8s 0.1s ease both;
}
#landing-root .hero-title em { font-style: italic; color: var(--cyan); }

#landing-root .hero-sub {
  font-size: 1.05rem;
  font-weight: 300;
  color: var(--muted);
  max-width: 500px;
  line-height: 1.75;
  margin-bottom: 1rem;
  animation: fadeUp 0.8s 0.2s ease both;
}

#landing-root .hero-sub2 {
  font-size: 0.88rem;
  color: var(--muted2);
  margin-bottom: 3rem;
  font-style: italic;
  animation: fadeUp 0.8s 0.28s ease both;
}

#landing-root .hero-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeUp 0.8s 0.38s ease both;
}

#landing-root .btn-primary {
  background: var(--cyan);
  color: var(--ink);
  font-family: var(--font-dm-sans, 'DM Sans'), sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 1rem 2.5rem;
  border-radius: 100px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 35px var(--cyan-glow);
  display: inline-block;
}
#landing-root .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 55px var(--cyan-glow);
}

#landing-root .btn-ghost {
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 300;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.2s;
}
#landing-root .btn-ghost:hover { color: var(--white); }

#landing-root .hero-scroll {
  position: absolute;
  bottom: 2.5rem; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column;
  align-items: center; gap: 0.5rem;
  color: var(--muted2);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  animation: fadeUp 1s 0.9s ease both;
}
#landing-root .scroll-line {
  width: 1px; height: 40px;
  background: linear-gradient(to bottom, var(--cyan), transparent);
  animation: scrollPulse 2s infinite;
}

/* ─── STATS ─── */
#landing-root .stats-bar {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  padding: 3rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  position: relative; z-index: 1;
}
#landing-root .stat-item { padding: 0.5rem 1rem; }
#landing-root .stat-item + .stat-item { border-left: 1px solid var(--border); }
#landing-root .stat-num {
  font-family: var(--font-cormorant, 'Cormorant Garamond'), serif;
  font-size: 4rem; font-weight: 300;
  color: var(--cyan); line-height: 1;
  margin-bottom: 0.4rem;
}
#landing-root .stat-label {
  font-size: 0.75rem; color: var(--muted);
  letter-spacing: 0.1em; text-transform: uppercase;
}

/* ─── SECTIONS ─── */
#landing-root .section-wrap {
  position: relative; z-index: 1;
  padding: 7rem 3rem;
  max-width: 1100px;
  margin: 0 auto;
}

#landing-root .section-label {
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 1rem;
  display: block;
}

#landing-root .section-title {
  font-family: var(--font-cormorant, 'Cormorant Garamond'), serif;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  font-weight: 300;
  line-height: 1.12;
  letter-spacing: -0.01em;
  margin-bottom: 1.5rem;
}
#landing-root .section-title em { font-style: italic; color: var(--cyan); }

#landing-root .section-body {
  font-size: 1rem; color: var(--muted);
  line-height: 1.8; max-width: 560px;
  margin-bottom: 1rem;
}

#landing-root .divider { width: 100%; height: 1px; background: var(--border); position: relative; z-index: 1; }

#landing-root .surface-bg { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }

/* ─── PROBLEMA ─── */
#landing-root .problem-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 4rem;
  align-items: start;
}

#landing-root .problem-list,
#landing-root .solution-list {
  list-style: none;
  display: flex; flex-direction: column; gap: 1rem;
}

#landing-root .problem-list li,
#landing-root .solution-list li {
  display: flex; align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem 1.2rem;
  border-radius: 10px;
  font-size: 0.92rem;
  line-height: 1.5;
}

#landing-root .problem-list li {
  background: rgba(248,113,113,0.06);
  border: 1px solid rgba(248,113,113,0.12);
  color: var(--muted);
}

#landing-root .problem-mark { color: var(--red); font-weight: 600; flex-shrink: 0; }

#landing-root .solution-list li {
  background: rgba(52,211,153,0.05);
  border: 1px solid rgba(52,211,153,0.12);
  color: var(--muted);
}
#landing-root .solution-mark { color: var(--green); font-weight: 600; flex-shrink: 0; }

#landing-root .problem-conclusion {
  margin-top: 1.5rem;
  padding: 1rem 1.2rem;
  border-left: 3px solid var(--red);
  background: rgba(248,113,113,0.05);
  border-radius: 0 8px 8px 0;
  font-size: 0.88rem;
  color: var(--red);
  font-style: italic;
}

#landing-root .solution-conclusion {
  margin-top: 1.5rem;
  padding: 1rem 1.2rem;
  border-left: 3px solid var(--green);
  background: rgba(52,211,153,0.05);
  border-radius: 0 8px 8px 0;
  font-size: 0.88rem;
  color: var(--green);
  font-style: italic;
}

#landing-root .col-label {
  font-family: var(--font-cormorant, 'Cormorant Garamond'), serif;
  font-size: 1.6rem; font-weight: 400;
  margin-bottom: 1.5rem;
}

/* ─── FEATURES GRID ─── */
#landing-root .features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 4rem;
}

#landing-root .feature-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  transition: border-color 0.3s, transform 0.3s, background 0.3s;
}
#landing-root .feature-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-4px);
  background: var(--card-hover);
}
#landing-root .feature-icon { font-size: 1.8rem; margin-bottom: 1rem; display: block; }
#landing-root .feature-title {
  font-family: var(--font-cormorant, 'Cormorant Garamond'), serif;
  font-size: 1.45rem; font-weight: 400;
  margin-bottom: 0.75rem; color: var(--white);
}
#landing-root .feature-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.7; }

#landing-root .feature-tags {
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  margin-top: 1rem;
}
#landing-root .tag {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.65rem;
  border-radius: 100px;
  border: 1px solid var(--border-accent);
  color: var(--cyan);
  background: var(--cyan-soft);
}

/* ─── ODONTOGRAMA ─── */
#landing-root .estados-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 2rem;
}

#landing-root .estado-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--card);
  border-radius: 10px;
  border: 1px solid var(--border);
  font-size: 0.88rem;
}

#landing-root .estado-dot {
  width: 10px; height: 10px;
  border-radius: 50%; flex-shrink: 0;
}

#landing-root .estado-name { font-weight: 500; color: var(--white); }
#landing-root .estado-desc { color: var(--muted); font-size: 0.8rem; }

#landing-root .superficies-bar {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--card);
  border: 1px solid var(--border-accent);
  border-radius: 10px;
  font-size: 0.88rem;
  color: var(--muted);
}
#landing-root .superficies-bar strong { color: var(--cyan); }

/* ─── COMPARATIVA ─── */
#landing-root .compare-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 3rem;
  border-radius: 14px;
  overflow: hidden;
}

#landing-root .compare-table th {
  padding: 1rem 1.5rem;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

#landing-root .compare-table th:first-child { background: #1a2a3d; text-align: left; }
#landing-root .compare-table th:nth-child(2) { background: rgba(248,113,113,0.15); color: var(--red); }
#landing-root .compare-table th:nth-child(3) { background: rgba(52,211,153,0.15); color: var(--green); }

#landing-root .compare-table td {
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border);
}

#landing-root .compare-table td:first-child {
  background: var(--card);
  font-weight: 500;
  color: var(--white);
}

#landing-root .compare-table td:nth-child(2) {
  background: rgba(248,113,113,0.04);
  color: var(--muted);
  text-align: center;
}

#landing-root .compare-table td:nth-child(3) {
  background: rgba(52,211,153,0.04);
  color: var(--muted);
  text-align: center;
}

#landing-root .compare-table tr:last-child td:nth-child(3) {
  color: var(--green);
  font-weight: 600;
}

/* ─── ROI ─── */
#landing-root .roi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}

#landing-root .roi-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 2rem;
  text-align: center;
  transition: border-color 0.3s;
}
#landing-root .roi-card:hover { border-color: var(--border-accent); }

#landing-root .roi-num {
  font-family: var(--font-cormorant, 'Cormorant Garamond'), serif;
  font-size: 3.5rem; font-weight: 300;
  line-height: 1; margin-bottom: 0.5rem;
}

#landing-root .roi-label { font-size: 0.8rem; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }

#landing-root .roi-details {
  display: flex; flex-direction: column; gap: 1rem;
  margin-top: 3rem;
}

#landing-root .roi-detail-item {
  display: flex; align-items: flex-start; gap: 1rem;
  padding: 1.2rem 1.5rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

#landing-root .roi-detail-icon { font-size: 1.5rem; flex-shrink: 0; }
#landing-root .roi-detail-title { font-weight: 500; color: var(--white); margin-bottom: 0.2rem; font-size: 0.92rem; }
#landing-root .roi-detail-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.5; }

/* ─── PRUEBA GRATIS ─── */
#landing-root .trial-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 7rem 3rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem; align-items: center;
}

#landing-root .trial-list {
  list-style: none;
  margin-top: 2.5rem;
  display: flex; flex-direction: column; gap: 1rem;
}
#landing-root .trial-list li {
  display: flex; align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.93rem; color: var(--muted); line-height: 1.5;
}
#landing-root .trial-list li::before { content: '—'; color: var(--cyan); flex-shrink: 0; margin-top: 0.1em; }

#landing-root .trial-cta-box {
  background: linear-gradient(135deg, rgba(34,211,238,0.09), rgba(34,211,238,0.03));
  border: 1px solid rgba(34,211,238,0.22);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
}

#landing-root .trial-badge {
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cyan);
  border: 1px solid var(--border-accent);
  background: var(--cyan-soft);
  padding: 0.35rem 0.9rem;
  border-radius: 100px;
  margin-bottom: 1.5rem;
}

#landing-root .trial-headline {
  font-family: var(--font-cormorant, 'Cormorant Garamond'), serif;
  font-size: 3.2rem; font-weight: 300;
  line-height: 1.1; margin-bottom: 0.75rem;
}

#landing-root .trial-headline em { font-style: italic; color: var(--cyan); }

#landing-root .trial-sub {
  font-size: 0.88rem; color: var(--muted);
  margin-bottom: 2rem; line-height: 1.65;
}

#landing-root .trial-economic {
  margin-top: 1.25rem;
  font-size: 0.78rem; color: var(--muted2);
  font-style: italic;
}

/* ─── CONTACTO ─── */
#landing-root .contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 3.5rem;
}

#landing-root .contact-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.75rem;
  display: flex; flex-direction: column; gap: 0.5rem;
  transition: border-color 0.3s, transform 0.2s;
}
#landing-root .contact-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-3px);
}

#landing-root .contact-type {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cyan);
}

#landing-root .contact-value {
  font-size: 0.93rem; color: var(--white);
  text-decoration: none; font-weight: 400;
  word-break: break-all;
  transition: color 0.2s;
}
#landing-root .contact-value:hover { color: var(--cyan); }

/* ─── FOOTER ─── */
#landing-root footer {
  border-top: 1px solid var(--border);
  padding: 2.5rem 3rem;
  text-align: center;
  color: var(--muted2);
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  position: relative; z-index: 1;
}
#landing-root footer a { color: var(--cyan); text-decoration: none; }

/* ─── ANIMATIONS ─── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}

/* ─── RESPONSIVE ─── */
@media (max-width: 768px) {
  #landing-root nav { padding: 1rem 1.5rem; }
  #landing-root .nav-right .nav-link { display: none; }
  #landing-root .section-wrap { padding: 5rem 1.5rem; }
  #landing-root .stats-bar { grid-template-columns: 1fr; padding: 2rem 1.5rem; }
  #landing-root .stat-item + .stat-item { border-left: none; border-top: 1px solid var(--border); }
  #landing-root .problem-grid { grid-template-columns: 1fr; gap: 2rem; }
  #landing-root .estados-grid { grid-template-columns: 1fr; }
  #landing-root .roi-grid { grid-template-columns: 1fr; }
  #landing-root .compare-table { font-size: 0.8rem; }
  #landing-root .compare-table th,
  #landing-root .compare-table td { padding: 0.75rem 0.8rem; }
  #landing-root .trial-inner { grid-template-columns: 1fr; gap: 3rem; padding: 5rem 1.5rem; }
  #landing-root footer { padding: 2rem 1.5rem; }
}
`

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: landingCSS }} />
      <div id="landing-root">

        {/* NAV */}
        <nav>
          <a href="#" className="nav-logo">Sonris<span>app</span></a>
          <div className="nav-right">
            <a href="#funciones" className="nav-link">Funciones</a>
            <a href="#contacto" className="nav-link">Contacto</a>
            <a href="https://mi-consultorio-odonto.netlify.app" className="nav-ingresar" target="_blank" rel="noopener noreferrer">Ingresar →</a>
            <a href="#prueba" className="nav-cta">Prueba gratis</a>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-glow"></div>
          <span className="hero-badge">🦷 Sistema de Gestión Odontológica Profesional</span>
          <h1 className="hero-title">Tu consultorio,<br /><em>sin el caos</em></h1>
          <p className="hero-sub">Agenda digital inteligente con odontograma interactivo, gestión de pacientes y notificaciones automáticas. 100% digital, disponible 24/7.</p>
          <p className="hero-sub2">Accesible desde cualquier dispositivo · Sin instalaciones · Listo en minutos</p>
          <div className="hero-actions">
            <a href="#prueba" className="btn-primary">Empezar prueba gratuita →</a>
            <a href="#funciones" className="btn-ghost">Ver todas las funciones</a>
          </div>
          <p className="hero-sub2" style={{ marginBottom: 0 }}>
            ¿Ya tenés cuenta?{' '}
            <a href="https://mi-consultorio-odonto.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Ingresá acá →</a>
          </p>
          <div className="hero-scroll">
            <div className="scroll-line"></div>
            <span>Explorá</span>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-num">10h</div>
            <div className="stat-label">Ahorradas por semana</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">40%</div>
            <div className="stat-label">Menos ausencias</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">∞</div>
            <div className="stat-label">Pacientes sin límite</div>
          </div>
        </div>

        {/* PROBLEMA / SOLUCIÓN */}
        <div className="surface-bg">
          <div className="section-wrap">
            <span className="section-label">El panorama actual</span>
            <h2 className="section-title">Los odontólogos pierden tiempo<br /><em>valioso cada día</em></h2>
            <div className="problem-grid">
              <div>
                <div className="col-label" style={{ color: 'var(--red)' }}>Sin Sonrisapp</div>
                <ul className="problem-list">
                  <li><span className="problem-mark">✗</span> <span>Llamadas telefónicas constantes para agendar turnos</span></li>
                  <li><span className="problem-mark">✗</span> <span>Agendas en papel difíciles de gestionar</span></li>
                  <li><span className="problem-mark">✗</span> <span>Pacientes que olvidan sus turnos</span></li>
                  <li><span className="problem-mark">✗</span> <span>Historiales médicos en papel desorganizados</span></li>
                  <li><span className="problem-mark">✗</span> <span>Sin registro digital del estado dental</span></li>
                  <li><span className="problem-mark">✗</span> <span>Horas administrativas que no generan ingresos</span></li>
                </ul>
                <div className="problem-conclusion">Todo esto reduce la productividad y aumenta el estrés</div>
              </div>
              <div>
                <div className="col-label" style={{ color: 'var(--green)' }}>Con Sonrisapp</div>
                <ul className="solution-list">
                  <li><span className="solution-mark">✓</span> <span>Agenda digital inteligente y automática</span></li>
                  <li><span className="solution-mark">✓</span> <span>Base de datos completa de pacientes</span></li>
                  <li><span className="solution-mark">✓</span> <span>Odontograma interactivo profesional (Sistema FDI)</span></li>
                  <li><span className="solution-mark">✓</span> <span>Notificaciones automáticas por email</span></li>
                  <li><span className="solution-mark">✓</span> <span>Estadísticas y reportes en tiempo real</span></li>
                  <li><span className="solution-mark">✓</span> <span>Exportación a PDF profesional</span></li>
                </ul>
                <div className="solution-conclusion">¡Más tiempo para lo que realmente importa: tus pacientes!</div>
              </div>
            </div>
          </div>
        </div>

        {/* FUNCIONES */}
        <div className="section-wrap" id="funciones">
          <span className="section-label">Funcionalidades</span>
          <h2 className="section-title">Todo lo que necesitás,<br /><em>nada que no uses</em></h2>
          <p className="section-body">Diseñada específicamente para consultorios odontológicos que quieren modernizarse sin complicaciones.</p>

          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📅</span>
              <div className="feature-title">Gestión Inteligente de Turnos</div>
              <p className="feature-desc">Dashboard completo con todos tus turnos organizados por fecha, estado y paciente. Aprobá o rechazá solicitudes con un solo click. Estados visuales: Pendiente, Confirmado, Completado, Cancelado.</p>
              <div className="feature-tags">
                <span className="tag">Vista profesional</span>
                <span className="tag">Portal del paciente</span>
                <span className="tag">24/7</span>
              </div>
            </div>

            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <div className="feature-title">Base de Datos Profesional</div>
              <p className="feature-desc">Ficha completa de cada paciente con todos sus datos. Historial completo de turnos pasados y futuros. Estadísticas por paciente: turnos totales, completados, cancelados. Búsqueda instantánea por nombre, email o teléfono.</p>
              <div className="feature-tags">
                <span className="tag">100% seguro</span>
                <span className="tag">Búsqueda instantánea</span>
                <span className="tag">Multi-dispositivo</span>
              </div>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🦷</span>
              <div className="feature-title">Odontograma Interactivo</div>
              <p className="feature-desc">Sistema FDI Internacional. Click en cada superficie del diente para marcar estado. Dentición completa: permanente (32 dientes) y temporaria (20 dientes). Exportación a PDF profesional con un click.</p>
              <div className="feature-tags">
                <span className="tag">Sistema FDI</span>
                <span className="tag">Interfaz visual</span>
                <span className="tag">Export PDF</span>
              </div>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📧</span>
              <div className="feature-title">Notificaciones Automáticas</div>
              <p className="feature-desc">Emails automáticos por cada evento importante. Recordatorios de turnos próximos. Envío masivo de notificaciones a todos los pacientes. Plantillas personalizables con tu marca. Integración con Resend (3.000 emails gratis/mes).</p>
              <div className="feature-tags">
                <span className="tag">Recordatorios</span>
                <span className="tag">Envío masivo</span>
                <span className="tag">Personalizable</span>
              </div>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <div className="feature-title">Registro con Código QR</div>
              <p className="feature-desc">Tu QR único personalizado. Pacientes se registran en segundos. Descargá y compartí para posters, redes sociales y tarjetas. Modernizá la captación de pacientes automáticamente.</p>
              <div className="feature-tags">
                <span className="tag">Generación automática</span>
                <span className="tag">Personalizable</span>
                <span className="tag">Marketing digital</span>
              </div>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <div className="feature-title">Dashboard Profesional</div>
              <p className="feature-desc">Estadísticas en tiempo real. Turnos de hoy destacados. Total de pacientes activos. Gráficos visuales de tendencias. Turnos completados vs cancelados. Notificaciones pendientes y acceso rápido a todas las funciones.</p>
              <div className="feature-tags">
                <span className="tag">Tiempo real</span>
                <span className="tag">Gráficos</span>
                <span className="tag">Branding propio</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* ODONTOGRAMA DETALLE */}
        <div className="surface-bg">
          <div className="section-wrap">
            <span className="section-label">⭐ Incluido en tu suscripción</span>
            <h2 className="section-title">Odontograma<br /><em>Interactivo Profesional</em></h2>
            <p className="section-body">El estándar mundial para el registro clínico dental, digitalizado y fácil de usar.</p>

            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond'), serif", fontSize: '1.8rem', fontWeight: 400, marginBottom: '1.5rem', color: 'var(--white)' }}>7 Estados Clínicos</h3>
              <div className="estados-grid">
                <div className="estado-item">
                  <div className="estado-dot" style={{ background: '#34d399' }}></div>
                  <div><div className="estado-name">Sano</div><div className="estado-desc">Diente sin patologías</div></div>
                </div>
                <div className="estado-item">
                  <div className="estado-dot" style={{ background: '#f87171' }}></div>
                  <div><div className="estado-name">Caries</div><div className="estado-desc">Lesión cariosa detectada</div></div>
                </div>
                <div className="estado-item">
                  <div className="estado-dot" style={{ background: '#60a5fa' }}></div>
                  <div><div className="estado-name">Restauración</div><div className="estado-desc">Obturación realizada</div></div>
                </div>
                <div className="estado-item">
                  <div className="estado-dot" style={{ background: '#fbbf24' }}></div>
                  <div><div className="estado-name">Corona</div><div className="estado-desc">Corona protésica</div></div>
                </div>
                <div className="estado-item">
                  <div className="estado-dot" style={{ background: '#f87171' }}></div>
                  <div><div className="estado-name">Fractura</div><div className="estado-desc">Diente fracturado</div></div>
                </div>
                <div className="estado-item">
                  <div className="estado-dot" style={{ background: '#9ca3af' }}></div>
                  <div><div className="estado-name">Ausente</div><div className="estado-desc">Diente faltante</div></div>
                </div>
                <div className="estado-item">
                  <div className="estado-dot" style={{ background: '#34d399' }}></div>
                  <div><div className="estado-name">Implante</div><div className="estado-desc">Implante dental</div></div>
                </div>
              </div>
              <div className="superficies-bar">
                <strong>5 Superficies por Diente:</strong> Vestibular · Lingual · Mesial · Distal · Oclusal
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* COMPARATIVA */}
        <div className="section-wrap">
          <span className="section-label">Comparativa</span>
          <h2 className="section-title">Método tradicional<br /><em>vs Sonrisapp</em></h2>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Aspecto</th>
                <th>✗ Método Tradicional</th>
                <th>✓ Sonrisapp</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Agenda</td><td>Papel, desorganizada</td><td>Digital, automática, 24/7</td></tr>
              <tr><td>Turnos</td><td>Solo por llamada</td><td>Online, auto-gestionados</td></tr>
              <tr><td>Recordatorios</td><td>Llamadas manuales</td><td>Emails automáticos</td></tr>
              <tr><td>Odontograma</td><td>Papel, difícil de leer</td><td>Digital, visual, exportable</td></tr>
              <tr><td>Historiales</td><td>Archivos físicos</td><td>Base de datos digital</td></tr>
              <tr><td>Reportes</td><td>Manual, tedioso</td><td>Automático, PDF en 1 click</td></tr>
              <tr><td>Costo mensual</td><td>Papelería + tiempo perdido</td><td>Accesible. 1 mes gratis para empezar</td></tr>
            </tbody>
          </table>
        </div>

        <div className="divider"></div>

        {/* ROI */}
        <div className="surface-bg">
          <div className="section-wrap">
            <span className="section-label">Retorno de inversión</span>
            <h2 className="section-title">Beneficios medibles<br /><em>desde el primer mes</em></h2>
            <div className="roi-grid">
              <div className="roi-card">
                <div className="roi-num" style={{ color: 'var(--green)' }}>10h</div>
                <div className="roi-label">Ahorradas por semana</div>
              </div>
              <div className="roi-card">
                <div className="roi-num" style={{ color: 'var(--cyan)' }}>40%</div>
                <div className="roi-label">Menos ausencias</div>
              </div>
              <div className="roi-card">
                <div className="roi-num" style={{ color: 'var(--gold)' }}>+30%</div>
                <div className="roi-label">Más productividad</div>
              </div>
            </div>
            <div className="roi-details">
              <div className="roi-detail-item">
                <div className="roi-detail-icon">⏰</div>
                <div>
                  <div className="roi-detail-title">Más tiempo clínico</div>
                  <div className="roi-detail-desc">Menos tareas administrativas = más tiempo para atender pacientes y hacer lo que te apasiona.</div>
                </div>
              </div>
              <div className="roi-detail-item">
                <div className="roi-detail-icon">💰</div>
                <div>
                  <div className="roi-detail-title">Más ingresos</div>
                  <div className="roi-detail-desc">Menos huecos en la agenda = más turnos completados = más productividad para tu consultorio.</div>
                </div>
              </div>
              <div className="roi-detail-item">
                <div className="roi-detail-icon">😊</div>
                <div>
                  <div className="roi-detail-title">Pacientes más satisfechos</div>
                  <div className="roi-detail-desc">Una experiencia moderna y profesional genera confianza y fidelidad en tus pacientes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRUEBA GRATIS */}
        <div id="prueba">
          <div className="trial-inner">
            <div>
              <span className="section-label">Sin compromiso</span>
              <h2 className="section-title">Probá Sonrisapp<br /><em>un mes gratis</em></h2>
              <ul className="trial-list">
                <li>Acceso completo a todas las funciones desde el día uno</li>
                <li>Sin tarjeta de crédito requerida para comenzar</li>
                <li>Configuración en menos de 10 minutos</li>
                <li>Soporte personal incluido durante la prueba</li>
                <li>Sin costos de instalación ni permanencia</li>
                <li>Cancelás cuando querés, sin preguntas</li>
                <li>Precio accesible pensado para el consultorio local</li>
                <li>Actualizaciones automáticas incluidas siempre</li>
              </ul>
            </div>
            <div className="trial-cta-box">
              <span className="trial-badge">Oferta de bienvenida</span>
              <div className="trial-headline">1 mes<br /><em>sin costo</em></div>
              <p className="trial-sub">Comenzá hoy y experimentá la diferencia en tu consultorio. Sin riesgos, sin letra chica, sin sorpresas.</p>
              <a href="mailto:colaboradormariobritto@gmail.com?subject=Quiero probar Sonrisapp 1 mes gratis" className="btn-primary">
                Quiero probarlo gratis →
              </a>
              <p className="trial-economic">Económico para cualquier consultorio. Menor costo que una sola consulta.</p>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* CONTACTO */}
        <div className="section-wrap" id="contacto">
          <span className="section-label">Contacto</span>
          <h2 className="section-title">¿Tenés dudas?<br /><em>Estamos acá para vos</em></h2>
          <p className="section-body">Contactanos por el canal que prefieras. Respondemos rápido y con gusto te ayudamos a dar el primer paso.</p>
          <div className="contact-grid">
            <div className="contact-card">
              <span className="contact-type">WhatsApp</span>
              <a href="https://wa.me/542945415186" className="contact-value" target="_blank" rel="noopener noreferrer">+54 294 541 5186</a>
            </div>
            <div className="contact-card">
              <span className="contact-type">Email</span>
              <a href="mailto:colaboradormariobritto@gmail.com" className="contact-value">colaboradormariobritto@gmail.com</a>
            </div>
            <div className="contact-card">
              <span className="contact-type">Producto</span>
              <a href="https://www.sonrisapp.com" className="contact-value" target="_blank" rel="noopener noreferrer">www.sonrisapp.com</a>
            </div>
            <div className="contact-card">
              <span className="contact-type">Empresa</span>
              <a href="https://www.cosasanta.com" className="contact-value" target="_blank" rel="noopener noreferrer">www.cosasanta.com</a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer>
          <p>© 2026 Sonrisapp · Desarrollado por <a href="https://www.cosasanta.com" target="_blank" rel="noopener noreferrer">Cosasanta</a> · <a href="https://www.sonrisapp.com" target="_blank" rel="noopener noreferrer">www.sonrisapp.com</a> · <a href="mailto:colaboradormariobritto@gmail.com">colaboradormariobritto@gmail.com</a></p>
        </footer>

      </div>
    </>
  )
}
