import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Analyze() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ patientName: '', patientAge: '' })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!imageFile || !form.patientName || !form.patientAge) {
      alert('Please fill all fields and upload an X-ray!')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('patientName', form.patientName)
      formData.append('patientAge', form.patientAge)

      const data = await api.post('/xray/analyze', formData, true)
      navigate(`/reports/${data.id}`)
    } catch (err) {
      alert('Analysis failed! Make sure all 3 services are running.')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h2>Upload Chest X-Ray</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
          Upload a chest X-ray for AI diagnosis with Grad-CAM heatmap
        </p>

        <div className="form-group">
          <label>Patient Name</label>
          <input placeholder="John Doe"
            value={form.patientName}
            onChange={e => setForm({ ...form, patientName: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Patient Age</label>
          <input placeholder="45" type="number"
            value={form.patientAge}
            onChange={e => setForm({ ...form, patientAge: e.target.value })} />
        </div>

        <div className="form-group">
          <label>X-Ray Image</label>
          <input type="file" accept="image/*" onChange={handleImage}
            style={{ padding: '8px', border: '1.5px solid #d1d5db', borderRadius: '8px', width: '100%' }} />
        </div>

        {preview && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <img src={preview} alt="preview"
              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
        )}

        <button className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '14px' }}>
          {loading ? 'AI Analyzing... (30-60 seconds)' : 'Analyze X-Ray with AI'}
        </button>
      </div>
    </div>
  )
}

export default Analyze