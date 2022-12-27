/*eslint-disable*/
// ** React Imports
import { useState, useEffect } from "react"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
// import { selectChat, selectChatUser } from './store'
import { selectChatUser } from "./store"
import { useDispatch } from "react-redux"

// ** Utils
import { formatDateToMonthShort, isObjEmpty } from "@utils"

// ** Third Party Components
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"
import { X, Search, CheckSquare, Bell, User, Trash } from "react-feather"

// ** Reactstrap Imports
import {
  CardText,
  InputGroup,
  InputGroupText,
  Badge,
  Input,
  Button,
  Label
} from "reactstrap"

const SidebarLeft = (props) => {
  // ** Props & Store
  const {
    store,
    sidebar,
    handleSidebar,
    userSidebarLeft,
    handleUserSidebarLeft
  } = props
  const { chats, contacts, userProfile } = store

  // ** Dispatch
  const dispatch = useDispatch()

  // ** State
  const [query, setQuery] = useState("")
  const [about, setAbout] = useState("")
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState("online")
  const [filteredChat, setFilteredChat] = useState([])
  // const [filteredContacts, setFilteredContacts] = useState([])

  // ** Handles User Chat Click
  const handleUserClick = (id) => {
    // dispatch(selectChat(id))
    dispatch(selectChatUser(id))
    setActive(id)
    if (sidebar === true) {
      handleSidebar()
    }
  }

  useEffect(() => {
    if (!isObjEmpty(store.selectedUser)) {
      if (store.selectedUser.chat) {
        setActive(store.selectedUser?.chat?.id)
      } else {
        setActive(store.selectedUser?.contact?.id)
      }
    }
  }, [])

  // ** Renders Chat
  const renderChats = () => {
    if (!chats || !chats.length) return null

    if (query.length && !filteredChat.length) {
      return (
        <li className="no-results show">
          <h6 className="mb-0">No Chats Found</h6>
        </li>
      )
    }

    const arrToMap = query.length && filteredChat.length ? filteredChat : chats
    // console.log("chats", chats)
    // console.log("arrToMap", arrToMap)

    return arrToMap.map((item) => {
      let time
      if (item?.chat?.lastMessage?.time) {
        time = formatDateToMonthShort(
          item?.chat?.lastMessage ? item?.chat?.lastMessage?.time : ""
        )
      } else {
        time = ""
      }
      // console.log("item", item)
      return (
        <li
          key={item.id}
          onClick={() => handleUserClick(item.id)}
          className={classnames({
            active: active === item.id
          })}
        >
          <Avatar
            img={item.avatar}
            imgHeight="42"
            imgWidth="42"
            status={item.status}
          />
          <div className="chat-info flex-grow-1">
            <h5 className="mb-0">{item.fullName}</h5>
            <CardText className="text-truncate">
              {item?.chat?.lastMessage
                ? item?.chat?.lastMessage?.message
                : chats[chats.length - 1]?.message}
            </CardText>
          </div>
          <div className="chat-meta text-nowrap">
            <small className="float-end mb-25 chat-time ms-25">
              {time ? time : ""}
            </small>
            {item?.chat?.unseenMsgs >= 1 ? (
              <Badge className="float-end" color="danger" pill>
                {item?.chat?.unseenMsgs}
              </Badge>
            ) : null}
          </div>
        </li>
      )
    })
  }

  // ** Renders Contact
  // const renderContacts = () => {
  //   if (contacts && contacts.length) {
  //     if (query.length && !filteredContacts.length) {
  //       return (
  //         <li className='no-results show'>
  //           <h6 className='mb-0'>No Chats Found</h6>
  //         </li>
  //       )
  //     } else {
  //       const arrToMap = query.length && filteredContacts.length ? filteredContacts : contacts
  //       return arrToMap.map(item => {
  //         return (
  //           <li key={item.fullName} onClick={() => handleUserClick(item.id)}>
  //             <Avatar img={item.avatar} imgHeight='42' imgWidth='42' />
  //             <div className='chat-info flex-grow-1'>
  //               <h5 className='mb-0'>{item.fullName}</h5>
  //               <CardText className='text-truncate'>{item.about}</CardText>
  //             </div>
  //           </li>
  //         )
  //       })
  //     }
  //   } else {
  //     return null
  //   }
  // }

  // ** Handles Filter
  const handleFilter = (e) => {
    setQuery(e.target.value)
    const searchFilterFunction = (contact) =>
      contact.fullName.toLowerCase().includes(e.target.value.toLowerCase())
    const filteredChatsArr = chats.filter(searchFilterFunction)
    const filteredContactssArr = contacts.filter(searchFilterFunction)
    setFilteredChat([...filteredChatsArr])
    setFilteredContacts([...filteredContactssArr])
  }

  const renderAboutCount = () => {
    if (
      userProfile &&
      userProfile.about &&
      userProfile.about.length &&
      about.length === 0
    ) {
      return userProfile.about.length
    } else {
      return about.length
    }
  }

  return store ? (
    <div className="sidebar-left">
      <div className="sidebar">
        <div
          className={classnames("chat-profile-sidebar", {
            show: userSidebarLeft
          })}
        >
          <header className="chat-profile-header">
            <div className="close-icon" onClick={handleUserSidebarLeft}>
              <X size={14} />
            </div>
            <div className="header-profile-sidebar">
              <Avatar
                className="box-shadow-1 avatar-border"
                img={userProfile.avatar}
                status={status}
                size="xl"
              />
              <h4 className="chat-user-name">{userProfile.fullName}</h4>
              <span className="user-post">{userProfile.role}</span>
            </div>
          </header>
          <PerfectScrollbar
            className="profile-sidebar-area"
            options={{ wheelPropagation: false }}
          >
            <h6 className="section-label mb-1">About</h6>
            <div className="about-user">
              <Input
                rows="5"
                type="textarea"
                defaultValue={userProfile.about}
                onChange={(e) => setAbout(e.target.value)}
                className={classnames("char-textarea", {
                  "text-danger": about && about.length > 120
                })}
              />
              <small className="counter-value float-end">
                <span className="char-count">{renderAboutCount()}</span> / 120
              </small>
            </div>
            <div className="mt-3">
              <Button color="primary">Logout</Button>
            </div>
          </PerfectScrollbar>
        </div>
        <div
          className={classnames("sidebar-content", {
            show: sidebar === true
          })}
        >
          <div className="sidebar-close-icon" onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className="chat-fixed-search">
            <div className="d-flex align-items-center w-100">
              <div
                className="sidebar-profile-toggle"
                onClick={handleUserSidebarLeft}
              >
                {Object.keys(userProfile).length ? (
                  <Avatar
                    className="avatar-border"
                    img={
                      "https://firebasestorage.googleapis.com/v0/b/nha-thuoc-cong-dong.appspot.com/o/file%2F285104129_381277510700592_6806479644717095601_n.png?alt=media&token=5e1fd8f2-c324-459b-b26d-696004625f78"
                    }
                    status={status}
                    imgHeight="42"
                    imgWidth="42"
                  />
                ) : null}
              </div>
              <p
                style={{
                  fontSize: 20,
                  marginTop: 16,
                  marginLeft: 12,
                  fontWeight: 600
                }}
              >
                Medigood chat
              </p>
              {/* <InputGroup className="input-group-merge ms-1 w-100">
                <InputGroupText className="round">
                  <Search className="text-muted" size={14} />
                </InputGroupText>
                <Input
                  value={query}
                  className="round"
                  placeholder="Search or start a new chat"
                  onChange={handleFilter}
                />
              </InputGroup> */}
            </div>
          </div>
          <PerfectScrollbar
            className="chat-user-list-wrapper list-group"
            options={{ wheelPropagation: false }}
          >
            <h4 className="chat-list-title">Chats</h4>
            <ul className="chat-users-list chat-list media-list">
              {renderChats()}
            </ul>
            {/* <h4 className='chat-list-title'>Contacts</h4>
            <ul className='chat-users-list contact-list media-list'>{renderContacts()}</ul> */}
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  ) : null
}

export default SidebarLeft
