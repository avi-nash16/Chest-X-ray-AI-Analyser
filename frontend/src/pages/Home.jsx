import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🫁</div>
      <h1 style={{ fontSize: '36px', color: '#0f172a', marginBottom: '12px' }}>
        AI Chest X-Ray Analyzer
      </h1>
      <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '500px', margin: '0 auto 32px' }}>
        Upload a chest X-ray and get instant AI diagnosis with 
        Grad-CAM heatmap visualization and clinical report
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn btn-primary" 
          onClick={() => navigate('/analyze')}>
          Analyze X-Ray
        </button>
        <button className="btn btn-secondary"
          onClick={() => navigate('/reports')}>
          View Reports
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginTop: '60px',
        maxWidth: '700px',
        margin: '60px auto 0'
      }}>
        {[
          { icon: '🔬', title: 'ResNet50 CNN', desc: 'Deep learning model trained on chest X-rays' },
          { icon: '🗺️', title: 'Grad-CAM', desc: 'Visual explanation of AI decisions' },
          { icon: '📋', title: 'Clinical Report', desc: 'AI generated radiology report via Groq' }
        ].map(card => (
          <div key={card.title} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{card.icon}</div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>
              {card.title}
            </h3>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home