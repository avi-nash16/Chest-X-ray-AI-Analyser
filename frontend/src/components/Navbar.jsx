import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/analyze', label: 'Analyze X-Ray' },
    { path: '/reports', label: 'Reports' },
  ]

  return (
    <nav style={{
      background: '#0f172a',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        onClick={() => navigate('/')}>
        <span style={{ fontSize: '20px' }}>🫁</span>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>
          XRay Analyzer AI
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {links.map(link => (
          <button key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              background: location.pathname === link.path 
                ? '#2563eb' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navbar