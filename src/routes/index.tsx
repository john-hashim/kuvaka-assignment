import { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

// Lazy load components
const Login = lazy(() => import('@/pages/auth/Login'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]

export default routes
