import axios from "axios";
import { create } from "zustand";
import { useAuthStore } from "./autStore";
import { toast } from "react-toastify";

const ENDPOINT = "https://chat-app-backend-4hs0.onrender.com"

export const useChatStore = create((set, get) => ({
  Chats: [],

  selectedChat: null,

  getUserChats: async () => {
    try {
      const res = await axios.get(`https://chat-app-backend-4hs0.onrender.com/api/chat`, { withCredentials: true });

      set({ Chats: res.data.chats });
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Failed to load chats"
      toast.error(err)
    }
  },
  accessChat: async (userId) => {
    try {
      const res = await axios.post(`${ENDPOINT}/api/chat/`, { userId }, { withCredentials: true });
      const { chat } = res.data;
      let chatsArray = get().Chats;
      let exist = false;
      chatsArray.forEach(ch => {
        if (ch._id === chat._id) {
          exist = true;
        }
      });
      if (!exist) {
        chatsArray.unshift(chat);
      }
      set({ Chats: chatsArray });
      set({ selectedChat: chat });
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Failed to access this chat"
      toast.error(err)
    }
  },
  createGroup: async (data) => {
    try {
      const res = await axios.post(`${ENDPOINT}/api/chat/group`, data, { withCredentials: true });
      set({ Chats: [...get().Chats, res.data.groupChat] });
      toast.success("New Group Chat is created")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Failed to create a group"
      toast.error(err)
    }
  },

  addMembers: async (data) => {
    try {
      const res = await axios.put(`${ENDPOINT}/api/chat/group/add`, data, { withCredentials: true });
      set({ selectedChat: res.data.group });
      toast.success("New Members are added")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Failed to add members"
      toast.error(err)
    }
  },
  removeMember: async (data) => {
    try {
      const res = await axios.put(`${ENDPOINT}/api/chat/group/remove`, data, { withCredentials: true });
      set({ selectedChat: res.data.group });
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Failed to remove member"
      toast.error(err)
    }
  },
  renameGroup: async (data) => {
    try {
      const res = await axios.put(`${ENDPOINT}/api/chat/group/rename`, data, { withCredentials: true });
      set({ selectedChat: res.data.group });
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(error.response? error.respnse.data.message : "Something went wrong" )
    }

  },

  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
  }
}))