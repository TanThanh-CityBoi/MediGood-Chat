/*eslint-disable*/
// ** React Imports
import { Fragment, useState, useEffect, useRef } from "react"

// ** Chat App Component Imports
import Chat from "./Chat"
import SidebarLeft from "./SidebarLeft"

// ** Third Party Components
import classnames from "classnames"

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux"
// import { getUserProfile, getChatContacts, getAllChat } from './store'
import { getAllChat, selectChatUser } from "./store"

// import '@styles/base/pages/app-chat.scss'
// import '@styles/base/pages/app-chat-list.scss'

import "../../../@core/scss/base/pages/app-chat-list.scss"
import "../../../@core/scss/base/pages/app-chat.scss"
import socketIOClient from "socket.io-client"

const host = "https://medigood-be.onrender.com"
const AppChat = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.chat)
  // console.log(store)
  // ** States
  const [user, setUser] = useState({})
  const [sidebar, setSidebar] = useState(false)
  const [userSidebarRight, setUserSidebarRight] = useState(false)
  const [userSidebarLeft, setUserSidebarLeft] = useState(false)

  // ** Sidebar & overlay toggle functions
  const handleSidebar = () => setSidebar(!sidebar)
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft)
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight)
  const handleOverlayClick = () => {
    setSidebar(false)
    setUserSidebarRight(false)
    setUserSidebarLeft(false)
  }

  // ** Set user function for Right Sidebar
  const handleUser = (obj) => setUser(obj)

  // ** Get data on Mount
  useEffect(() => {
    dispatch(getAllChat())
  }, [dispatch])

  // console.log("store?.selectedUser", store?.selectedUser)

  const socketRef = useRef()
  useEffect(() => {
    socketRef.current = socketIOClient(host, {
      withCredentials: true
    })

    socketRef.current.on("connect", () => {
      console.log("connected ở đây sẽ thành công")
    })

    socketRef.current.on("getMessageFromUser", (data) => {
      if (store?.selectedUser?.chat?.id) {
        dispatch(getAllChat())
        dispatch(selectChatUser(store?.selectedUser?.chat?.id))
      } else {
        dispatch(getAllChat())
      }
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  return (
    <Fragment>
      <SidebarLeft
        store={store}
        sidebar={sidebar}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
        handleUserSidebarLeft={handleUserSidebarLeft}
      />
      <div className="content-right">
        <div className="content-wrapper">
          <div className="content-body">
            <div
              className={classnames("body-content-overlay", {
                show:
                  userSidebarRight === true ||
                  sidebar === true ||
                  userSidebarLeft === true
              })}
              onClick={handleOverlayClick}
            ></div>
            <Chat
              store={store}
              handleUser={handleUser}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AppChat
