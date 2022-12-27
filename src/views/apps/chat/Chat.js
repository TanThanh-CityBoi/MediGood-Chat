/*eslint-disable*/

// ** React Imports
import ReactDOM from "react-dom"
import { useState, useEffect, useRef } from "react"
import { formatDateToMonthShort, isObjEmpty } from "@utils"
// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
import { selectChatUser } from "./store"
import { useDispatch } from "react-redux"

// ** Third Party Components
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"
import {
  MessageSquare,
  Menu,
  PhoneCall,
  Video,
  Search,
  MoreVertical,
  Mic,
  Image,
  Send
} from "react-feather"
import axios from "axios"
// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Button,
  InputGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  InputGroupText,
  UncontrolledDropdown
} from "reactstrap"
import { Fragment } from "react"

import socketIOClient from "socket.io-client"
const host = "https://medigood-be.onrender.com"

const ChatLog = ({
  handleUser,
  handleUserSidebarRight,
  handleSidebar,
  store,
  userSidebarLeft
}) => {
  // ** Props & Store
  const { userProfile, selectedUser, chats } = store

  // ** Refs & Dispatch
  const chatArea = useRef(null)
  const dispatch = useDispatch()

  // ** State
  const [msg, setMsg] = useState("")

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
  }

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length
    if (selectedUserLen) {
      scrollToBottom()
    }
  }, [selectedUser])

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog = []
    if (selectedUser.chat) {
      chatLog = selectedUser.chat.chat
    }

    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          msg: msg.message,
          time: msg.time
        })
      } else {
        chatMessageSenderId = msg.senderId
        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              msg: msg.message,
              time: msg.time
            }
          ]
        }
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })
    return formattedChatLog
  }

  const socketRef = useRef()
  useEffect(() => {
    socketRef.current = socketIOClient(host, {
      withCredentials: true
    })

    socketRef.current.on("connect", () => {
      console.log("Connect lần 2")
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  // console.log("selectedUser.chat.fullName", selectedUser?.chat?.fullName)

  // ** Renders user chat
  const renderChats = () => {
    // console.log("formattedChatData()", formattedChatData())
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classnames("chat", {
            "chat-left": item.senderId !== "admin"
          })}
        >
          <div className="chat-avatar">
            <Avatar
              imgWidth={36}
              imgHeight={36}
              className="box-shadow-1 cursor-pointer"
              img={
                item.senderId === "admin"
                  ? "https://firebasestorage.googleapis.com/v0/b/nha-thuoc-cong-dong.appspot.com/o/file%2F285104129_381277510700592_6806479644717095601_n.png?alt=media&token=5e1fd8f2-c324-459b-b26d-696004625f78"
                  : selectedUser?.userInfo?.avatar
              }
            />
          </div>

          <div className="chat-body">
            {item.messages.map((chat) => {
              return (
                <div>
                  <div key={chat.msg} className="chat-content">
                    {item.senderId === "admin" ? (
                      <Fragment>
                        {/* <p className="chat-time">
                          {formatDateToMonthShort(chat.time)}
                        </p> */}
                        <p>{chat.msg}</p>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <p>{chat.msg}</p>
                        {/* <p className="chat-time">
                          {formatDateToMonthShort(chat.time)}
                        </p> */}
                      </Fragment>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    })
  }

  // ** Opens right sidebar & handles its data
  const handleAvatarClick = (obj) => {
    handleUserSidebarRight()
    handleUser(obj)
  }

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (
      !Object.keys(selectedUser).length &&
      !userSidebarLeft &&
      window.innerWidth < 992
    ) {
      handleSidebar()
    }
  }

  // ** Sends New Msg
  const handleSendMsg = async (e) => {
    e.preventDefault()
    if (msg.trim().length) {
      setMsg("")
      axios
        .post(`${host}/api/user-chat/send-msg-to-user`, {
          id: selectedUser?.chat?.id,
          message: msg
        })
        .then(async () => {
          await dispatch(selectChatUser(selectedUser.chat.id))
          socketRef.current.emit("sendMessageToUser", {
            user: selectedUser?.chat?.id,
            message: msg
          })
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper =
    Object.keys(selectedUser).length && selectedUser.chat
      ? PerfectScrollbar
      : "div"

  // console.log("selectedUser", selectedUser)

  return (
    <div className="chat-app-window">
      <div
        className={classnames("start-chat-area", {
          "d-none": Object.keys(selectedUser).length
        })}
      >
        <div className="start-chat-icon mb-1">
          <MessageSquare />
        </div>
        <h4
          className="sidebar-toggle start-chat-text"
          onClick={handleStartConversation}
        >
          Start Conversation
        </h4>
      </div>
      {Object.keys(selectedUser).length ? (
        <div
          className={classnames("active-chat", {
            "d-none": selectedUser === null
          })}
        >
          <div className="chat-navbar">
            <header className="chat-header">
              <div className="d-flex align-items-center">
                <div
                  className="sidebar-toggle d-block d-lg-none me-1"
                  onClick={handleSidebar}
                >
                  <Menu size={21} />
                </div>
                <Avatar
                  imgHeight="36"
                  imgWidth="36"
                  img={selectedUser?.userInfo?.avatar}
                  // status={selectedUser?.contact?.status}
                  className="avatar-border user-profile-toggle m-0 me-1"
                  // onClick={() => handleAvatarClick(selectedUser?.contact)}
                />
                <h6 className="mb-0">{selectedUser?.userInfo?.fullName}</h6>
              </div>
            </header>
          </div>

          <ChatWrapper
            ref={chatArea}
            className="user-chats"
            options={{ wheelPropagation: false }}
          >
            {selectedUser.chat ? (
              <div className="chats">{renderChats()}</div>
            ) : null}
          </ChatWrapper>

          <Form className="chat-app-form" onSubmit={(e) => handleSendMsg(e)}>
            <InputGroup className="input-group-merge me-1 form-send-message">
              <Input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your message or use speech to text"
              />
            </InputGroup>
            <Button className="send" color="primary">
              <Send size={14} className="d-lg-none" />
              <span className="d-none d-lg-block">Send</span>
            </Button>
          </Form>
        </div>
      ) : null}
    </div>
  )
}

export default ChatLog
