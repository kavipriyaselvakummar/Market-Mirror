import { useState, useCallback } from 'react'
import InputForm from './components/InputForm'
import Dashboard from './components/Dashboard'
import Toast from './components/Toast'

export default function App() {
  const [view, setView] = useState('form')          // 'form' | 'dashboard'
  const [productId, setProductId] = useState(null)
  const [formData, setFormData] = useState({})
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const handleProductCreated = (id, data) => {
    setProductId(id)
    setFormData(data)
    setView('dashboard')
  }

  const handleNewAnalysis = () => {
    setView('form')
    setProductId(null)
    setFormData({})
  }

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {view === 'form' ? (
        <InputForm onProductCreated={handleProductCreated} showToast={showToast} />
      ) : (
        <Dashboard
          productId={productId}
          formData={formData}
          onNewAnalysis={handleNewAnalysis}
          showToast={showToast}
        />
      )}

      {/* Toast Container */}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} />
      ))}
    </>
  )
}
