'use client'

import { useEffect, useState } from 'react'

interface LinkItem {
  href: string
  text: string
  display: string
  visibility: string
  opacity: string
  height: string
  hidden: boolean
}

interface StorageItem {
  key: string
  value: string
}

export default function DiagnosticoPage() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [ls, setLs] = useState<StorageItem[]>([])
  const [ss, setSs] = useState<StorageItem[]>([])
  const [session, setSession] = useState<unknown>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // DOM
    const allLinks = document.querySelectorAll('a')
    const linkData: LinkItem[] = Array.from(allLinks).map((el) => {
      const style = window.getComputedStyle(el)
      const display = style.display
      const visibility = style.visibility
      const opacity = style.opacity
      const height = style.height
      return {
        href: el.getAttribute('href') ?? '(sin href)',
        text: el.innerText.trim() || '(sin texto)',
        display,
        visibility,
        opacity,
        height,
        hidden:
          display === 'none' ||
          visibility === 'hidden' ||
          opacity === '0' ||
          height === '0px',
      }
    })
    setLinks(linkData)

    // localStorage
    const lsItems: StorageItem[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) ?? ''
      lsItems.push({ key, value: localStorage.getItem(key) ?? '' })
    }
    setLs(lsItems)

    // sessionStorage
    const ssItems: StorageItem[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i) ?? ''
      ssItems.push({ key, value: sessionStorage.getItem(key) ?? '' })
    }
    setSs(ssItems)

    // Session
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => setSession(d))
      .catch(() => setSession('ERROR al hacer fetch'))
      .finally(() => setReady(true))
  }, [])

  const box: React.CSSProperties = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    fontFamily: 'monospace',
    fontSize: '12px',
  }

  const title: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'sans-serif',
  }

  const cell: React.CSSProperties = { padding: '4px 8px', textAlign: 'left' }

  if (!ready) {
    return <div style={{ padding: '2rem', fontFamily: 'monospace' }}>Recolectando datos...</div>
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '100%', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', color: '#0f172a' }}>
        Diagnóstico del dashboard — {new Date().toISOString()}
      </h1>

      {/* DOM */}
      <div style={box}>
        <div style={title}>DOM — todos los &lt;a&gt; ({links.length} encontrados)</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: '#e2e8f0' }}>
              {['href', 'texto', 'display', 'visibility', 'opacity', 'height'].map((h) => (
                <th key={h} style={{ ...cell, borderBottom: '1px solid #cbd5e1', fontFamily: 'sans-serif' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {links.map((item, i) => (
              <tr
                key={i}
                style={{
                  background: item.hidden ? '#fef2f2' : i % 2 === 0 ? '#fff' : '#f8fafc',
                }}
              >
                <td style={{ ...cell, color: '#2563eb', wordBreak: 'break-all', maxWidth: '200px' }}>{item.href}</td>
                <td style={{ ...cell }}>{item.text}</td>
                <td style={{ ...cell, color: item.display === 'none' ? '#ef4444' : '#16a34a', fontWeight: item.display === 'none' ? 700 : 400 }}>{item.display}</td>
                <td style={{ ...cell, color: item.visibility === 'hidden' ? '#ef4444' : '#16a34a', fontWeight: item.visibility === 'hidden' ? 700 : 400 }}>{item.visibility}</td>
                <td style={{ ...cell, color: item.opacity === '0' ? '#ef4444' : '#16a34a', fontWeight: item.opacity === '0' ? 700 : 400 }}>{item.opacity}</td>
                <td style={{ ...cell, color: item.height === '0px' ? '#ef4444' : '#16a34a', fontWeight: item.height === '0px' ? 700 : 400 }}>{item.height}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SESSION */}
      <div style={box}>
        <div style={title}>Session (/api/auth/session)</div>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {/* LOCAL STORAGE */}
      <div style={box}>
        <div style={title}>localStorage ({ls.length} keys)</div>
        {ls.length === 0 ? (
          <span style={{ color: '#64748b' }}>vacío</span>
        ) : (
          ls.map((item, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
              <span style={{ color: '#7c3aed', fontWeight: 600 }}>{item.key}</span>
              {' → '}
              <span style={{ wordBreak: 'break-all' }}>{item.value}</span>
            </div>
          ))
        )}
      </div>

      {/* SESSION STORAGE */}
      <div style={box}>
        <div style={title}>sessionStorage ({ss.length} keys)</div>
        {ss.length === 0 ? (
          <span style={{ color: '#64748b' }}>vacío</span>
        ) : (
          ss.map((item, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
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
