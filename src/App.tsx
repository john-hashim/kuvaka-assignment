import routes from './routes'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

function AppRoutes() {

  const getRouteElement = (path: string) => {
    return routes.find(r => r.path === path)?.element
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />    
      <Route path="/login" element={getRouteElement('/login')} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
