'use client'

import { useEffect, useState } from 'react'

interface NavItem {
  href: string
  text: string
  display: string
  visibility: string
  opacity: string
  height: string
}

interface StorageItem {
  key: string
  value: string
}

interface DiagData {
  navItems: NavItem[]
  localStorage: StorageItem[]
  sessionStorage: StorageItem[]
  session: unknown
  buildId: string
}

export default function DiagnosticoPage() {
  const [data, setData] = useState<DiagData | null>(null)

  useEffect(() => {
    async function collect() {
      // 1. DOM — links dentro de nav o aside
      const linkEls = document.querySelectorAll('nav a, aside a')
      const navItems: NavItem[] = Array.from(linkEls).map((el) => {
        const style = window.getComputedStyle(el)
        return {
          href: el.getAttribute('href') ?? '',
          text: (el as HTMLElement).innerText.trim(),
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          height: style.height,
        }
      })

      // 2. Storage
      const ls: StorageItem[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) ?? ''
        ls.push({ key, value: localStorage.getItem(key) ?? '' })
      }

      const ss: StorageItem[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i) ?? ''
        ss.push({ key, value: sessionStorage.getItem(key) ?? '' })
      }

      // 3. Session
      let session: unknown = null
      try {
        const res = await fetch('/api/auth/session')
        session = await res.json()
      } catch {
        session = 'ERROR al hacer fetch'
      }

      // 4. Build ID
      const buildId =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__NEXT_DATA__?.buildId ?? 'no disponible'

      setData({ navItems, localStorage: ls, sessionStorage: ss, session, buildId })
    }

    collect()
  }, [])

  const box: React.CSSProperties = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    fontFamily: 'monospace',
    fontSize: '13px',
  }

  const h2style: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  if (!data) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        Recolectando datos...
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '32px', color: '#0f172a' }}>
        /diagnostico — {new Date().toISOString()}
      </h1>

      {/* BUILD ID */}
      <div style={box}>
        <div style={h2style}>Build ID</div>
        <div>{data.buildId}</div>
      </div>

      {/* DOM ANALYSIS */}
      <div style={box}>
        <div style={h2style}>DOM Analysis — links en nav/aside ({data.navItems.length} encontrados)</div>
        {data.navItems.length === 0 ? (
          <div style={{ color: '#ef4444' }}>⚠ No se encontraron &lt;a&gt; dentro de nav ni aside en esta página.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#e2e8f0' }}>
                {['href', 'text', 'display', 'visibility', 'opacity', 'height'].map((h) => (
                  <th key={h} style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.navItems.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '5px 8px', color: '#2563eb' }}>{item.href}</td>
                  <td style={{ padding: '5px 8px' }}>{item.text}</td>
                  <td style={{ padding: '5px 8px', color: item.display === 'none' ? '#ef4444' : '#16a34a' }}>{item.display}</td>
                  <td style={{ padding: '5px 8px', color: item.visibility === 'hidden' ? '#ef4444' : '#16a34a' }}>{item.visibility}</td>
                  <td style={{ padding: '5px 8px' }}>{item.opacity}</td>
                  <td style={{ padding: '5px 8px', color: item.height === '0px' ? '#ef4444' : '#16a34a' }}>{item.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SESSION */}
      <div style={box}>
        <div style={h2style}>Session (/api/auth/session)</div>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
          {JSON.stringify(data.session, null, 2)}
        </pre>
      </div>

      {/* LOCAL STORAGE */}
      <div style={box}>
        <div style={h2style}>localStorage ({data.localStorage.length} keys)</div>
        {data.localStorage.length === 0 ? (
          <div style={{ color: '#64748b' }}>vacío</div>
        ) : (
          data.localStorage.map((item, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <span style={{ color: '#7c3aed', fontWeight: 600 }}>{item.key}</span>
              {' → '}
              <span style={{ wordBreak: 'break-all' }}>{item.value}</span>
            </div>
          ))
        )}
      </div>

      {/* SESSION STORAGE */}
      <div style={box}>
        <div style={h2style}>sessionStorage ({data.sessionStorage.length} keys)</div>
        {data.sessionStorage.length === 0 ? (
          <div style={{ color: '#64748b' }}>vacío</div>
        ) : (
          data.sessionStorage.map((item, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <span style={{ color: '#7c3aed', fontWeight: 600 }}>{item.key}</span>
              {' → '}
              <span style={{ wordBreak: 'break-all' }}>{item.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
