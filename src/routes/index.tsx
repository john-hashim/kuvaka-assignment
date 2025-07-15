import { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

// Lazy load components
const Login = lazy(() => import('@/pages/auth/Login'))
const Chat = lazy(() => import('@/pages/feature/Chat'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
]

export default routes
