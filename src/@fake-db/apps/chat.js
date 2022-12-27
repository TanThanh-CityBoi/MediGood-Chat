import mock from '../mock'
/*eslint-disable */
const data = {
  profileUser: {
    id: "admin",
    avatar: require('@src/assets/images/portrait/small/admin.png').default,
    fullName: 'John Doe',
    role: 'admin',
    about:
      'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
    status: 'online',
    settings: {
      isTwoStepAuthVerificationEnabled: true,
      isNotificationsOn: false
    }
  },
  contacts: [
    {
      id: "phuoc686735",
      fullName: 'Felecia Rower',
      role: 'Frontend Developer',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      avatar: require('@src/assets/images/portrait/small/avatar-s-2.jpg').default,
      status: 'offline'
    },
    {
      id: "phuoc123",
      fullName: 'Adalberto Granzin',
      role: 'UI/UX Designer',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: require('@src/assets/images/portrait/small/avatar-s-1.jpg').default,
      status: 'busy'
    }
  ],
  chats: [
    {
      id: "phuoc686735",
      userId: "phuoc686735",
      unseenMsgs: 0,
      chat: [
        {
          message: 'Hi',
          time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
          senderId: "admin"
        },
        {
          message: 'Hello. How can I help You?',
          time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
          senderId: "phuoc686735"
        }
      ]
    },
    {
      id: "phuoc123",
      userId: "phuoc123",
      unseenMsgs: 1,
      chat: [
        {
          message: "How can we help? We're here for you!",
          time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
          senderId: "admin"
        },
        {
          message: 'Hey John, I am looking for the best admin template. Could you please help me to find it out?',
          time: 'Mon Dec 10 2018 07:45:211 GMT+0000 (GMT)',
          senderId: "phuoc123"
        }
      ]
    }
  ]
}
/*eslint-enable */

const reOrderChats = (arr, from, to) => {
  const item = arr.splice(from, 1)

  // Move the item to its new position
  arr.splice(to, 0, item[0])
}

// ------------------------------------------------
// GET: Return Chats Contacts and Contacts
// ------------------------------------------------
mock.onGet('/apps/chat/chats-and-contacts').reply(() => {
  const chatsContacts = data.chats.map(chat => {
    const contact = data.contacts.find(c => c.id === chat.userId)
    contact.chat = { id: chat.id, unseenMsgs: chat.unseenMsgs, lastMessage: chat.chat[chat.chat.length - 1] }
    return contact
  })
  const profileUserData = {
    id: data.profileUser.id,
    avatar: data.profileUser.avatar,
    fullName: data.profileUser.fullName,
    status: data.profileUser.status
  }
  return [200, { chatsContacts, contacts: data.contacts, profileUser: profileUserData }]
})

// ------------------------------------------------
// GET: Return User Profile
// ------------------------------------------------
mock.onGet('/apps/chat/users/profile-user').reply(() => [200, data.profileUser])

// ------------------------------------------------
// GET: Return Single Chat
// ------------------------------------------------
mock.onGet('/apps/chat/get-chat').reply(config => {
  // Get event id from URL

  const userId = config.id

  // //  Convert Id to number
  // userId = Number(userId)

  const chat = data.chats.find(c => c.id === userId)
  if (chat) chat.unseenMsgs = 0
  const contact = data.contacts.find(c => c.id === userId)
  if (contact.chat) contact.chat.unseenMsgs = 0
  return [200, { chat, contact }]
})

// ------------------------------------------------
// POST: Add new chat message
// ------------------------------------------------
mock.onPost('/apps/chat/send-msg').reply(config => {
  // Get event from post data
  const { obj } = JSON.parse(config.data)

  let activeChat = data.chats.find(chat => chat.userId === obj.contact.id)

  const newMessageData = {
    message: obj.message,
    time: new Date(),
    senderId: "admin"
  }
  // If there's new chat for user create one
  let isNewChat = false
  if (activeChat === undefined) {
    isNewChat = true

    // const lastId = data.chats[length - 1].id

    data.chats.push({
      id: obj.contact.id,
      userId: obj.contact.id,
      unseenMsgs: 0,
      chat: [newMessageData]
    })
    activeChat = data.chats[data.chats.length - 1]
  } else {
    activeChat.chat.push(newMessageData)
  }

  const response = { newMessageData, id: obj.contact.id }
  if (isNewChat) response.chat = activeChat

  reOrderChats(
    data.chats,
    data.chats.findIndex(i => i.id === response.id),
    0
  )

  return [201, { response }]
})
