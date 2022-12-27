// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import axios from "axios"
/* eslint-disable */
const host = "https://medigood-be.onrender.com"
export const selectChatUser = createAsyncThunk(
  "select-chat-user",
  async (id, { dispatch }) => {
    const response = await axios.get(`${host}/api/user-chat/get-chat?id=${id}`)
    console.log("id", id)
    await dispatch(getAllChat())
    console.log("response.data", response.data)
    const data = {
      chat: {
        id: id,
        userId: id,
        chat: response.data.message.chat
      },
      userInfo: {
        fullName: response.data.userChat.name,
        avatar: response.data.userChat.avatar
      },
      selectedUser: {
        userId: id,
        id: id
      }
    }
    console.log("data", data)
    return data
  }
)

export const getAllChat = createAsyncThunk(
  "get-all-contacts-and-chats",
  async () => {
    const response = await axios.get(
      `${host}/api/user-chat/get-all-contacts-and-chats`
    )
    // console.log("response", response)
    const data = {
      profileUser: {
        id: "admin",
        avatar: require("@src/assets/images/portrait/small/admin.png").default,
        fullName: "Adminstrator",
        role: "admin",
        about:
          "Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.",
        status: "online",
        settings: {
          isTwoStepAuthVerificationEnabled: true,
          isNotificationsOn: false
        }
      },
      selectedUser: {},
      chats: response.data.users.map((user) => {
        return {
          about: user.about,
          avatar: user.avatar,
          chat: user.chat,
          fullName: user.name,
          id: user._id,
          role: user.role,
          status: user.status,
          unseenMsgs: user.chat.unseenMsgs
        }
      })
    }
    return data
  }
)

export const appChatSlice = createSlice({
  name: "appChat",
  initialState: {
    chats: [],
    userProfile: {},
    selectedUser: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllChat.fulfilled, (state, action) => {
        state.chats = action.payload.chats
        state.userProfile = action.payload.profileUser
      })
      .addCase(selectChatUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
  }
})

export default appChatSlice.reducer
