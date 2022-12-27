// ** React Imports
import { lazy } from 'react'

const Chat = lazy(() => import('../../views/apps/chat'))

const AppRoutes = [
  {
    path: '/chat',
    element: <Chat />,
    meta: {
      appLayout: true,
      className: 'chat-application'
    }
  }
]

export default AppRoutes
