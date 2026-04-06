import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/xray/reports/${id}`)
      .then(data => setReport(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleReview = async () => {
    await api.put(`/xray/reports/${id}/review`)
    setReport({ ...report, doctorReviewed: true })
  }

  if (loading) return <div className="card"><p>Loading...</p></div>
  if (!report) return <div className="card"><p>Report not found</p></div>

  let probabilities = {}
  try { probabilities = JSON.parse(report.probabilities) } catch {}

  return (
    <div>
      <button className="btn btn-secondary"
        onClick={() => navigate('/reports')}
        style={{ marginBottom: '16px' }}>
        Back to Reports
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2>{report.patientName}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Age: {report.patientAge}</p>
          </div>
          <span style={{
            background: report.doctorReviewed ? '#dcfce7' : '#dbeafe',
            color: report.doctorReviewed ? '#16a34a' : '#2563eb',
            padding: '6px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: '600'
          }}>
            {report.doctorReviewed ? 'Reviewed' : 'Pending Review'}
          </span>
        </div>

        <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>
            AI Prediction
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
              {report.prediction}
            </span>
            <span style={{ fontSize: '18px', color: '#2563eb', fontWeight: '600' }}>
              {report.confidence}% confidence
            </span>
          </div>

          {Object.entries(probabilities).map(([label, prob]) => (
            <div key={label} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>{label}</span><span>{prob}%</span>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: '99px', height: '6px' }}>
                <div style={{
                  background: label === report.prediction ? '#2563eb' : '#93c5fd',
                  width: `${prob}%`, height: '100%', borderRadius: '99px'
                }} />
              </div>
            </div>
          ))}
        </div>

        {report.heatmapBase64 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>
              Grad-CAM Heatmap
            </h3>
            <img src={`data:image/png;base64,${report.heatmapBase64}`}
              alt="Grad-CAM"
              style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>
            AI Radiology Report
          </h3>
          <div style={{
            background: '#f0f9ff', border: '1px solid #bae6fd',
            borderRadius: '8px', padding: '16px',
            fontSize: '14px', lineHeight: '1.7', color: '#0c4a6e'
          }}>
            {report.aiReport}
          </div>
        </div>

        {!report.doctorReviewed && (
          <button className="btn btn-success" onClick={handleReview}
            style={{ width: '100%', padding: '12px' }}>
            Mark as Doctor Reviewed
          </button>
        )}
      </div>
    </div>
  )
}

export default ReportDetail