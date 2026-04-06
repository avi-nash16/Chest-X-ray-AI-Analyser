import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Reports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/xray/reports')
      .then(data => setReports(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const getColor = (prediction) => {
    if (prediction === 'Normal') return { bg: '#dcfce7', color: '#16a34a' }
    if (prediction === 'Pneumonia') return { bg: '#fef9c3', color: '#ca8a04' }
    return { bg: '#fee2e2', color: '#dc2626' }
  }

  if (loading) return <div className="card"><p>Loading...</p></div>

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>All Reports</h2>
      {reports.length === 0 ? (
        <div className="card">
          <p style={{ color: '#6b7280' }}>No reports yet. Analyze an X-ray first!</p>
        </div>
      ) : reports.map(report => {
        const colors = getColor(report.prediction)
        return (
          <div key={report.id} className="card"
            style={{ cursor: 'pointer', marginBottom: '12px' }}
            onClick={() => navigate(`/reports/${report.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>
                  {report.patientName} — Age {report.patientAge}
                </h3>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(report.analyzedAt).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  background: colors.bg, color: colors.color,
                  padding: '4px 12px', borderRadius: '99px',
                  fontSize: '12px', fontWeight: '700'
                }}>
                  {report.prediction}
                </span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {report.confidence}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Reports