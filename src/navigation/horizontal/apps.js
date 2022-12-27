// ** Icons Import
import { Box, MessageSquare } from "react-feather"

export default [
  {
    id: "chats",
    title: "Chat App",
    icon: <Box />,
    children: [
      {
        id: "chat",
        title: "Chat",
        icon: <MessageSquare />,
        navLink: "/apps/chat"
      }
    ]
  }
]
