'use client'

import { useEffect, useState } from 'react'

export default function NavCounter() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const links = document.querySelectorAll('[data-navlink]')
    setCount(links.length)
  }, [])
  return (
    <div
      id="nav-diagnostic"
      style={{
        fontSize: '10px',
        color: '#94A3B8',
        padding: '4px 8px',
        borderTop: '1px solid #E2E8F0',
        marginTop: '8px'
      }}
    >
      dom-links: {count}
    </div>
  )
}
