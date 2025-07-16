import { ThemeToggle } from '@/components/common/theme-toggle'
import routes from './routes'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/theme-provider'
import { AuthProvider, useAuth } from './contexts/auth-context'

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <div className="fixed top-2 right-2 z-50">
            <ThemeToggle />
          </div>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

function AppRoutes() {

  const { isAuthenticated } = useAuth()

  const getRouteElement = (path: string) => {
    return routes.find(r => r.path === path)?.element
  }

  return (
<Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/chat/new" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={getRouteElement('/login')} />
      <Route path="/chat" element={<Navigate to="/chat/new" replace />} />
      <Route path="/chat/new" element={getRouteElement('/chat')} />
      <Route path="/chat/:threadId" element={getRouteElement('/chat')} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
