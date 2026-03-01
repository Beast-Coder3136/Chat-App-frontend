import axios from "axios";
import { create } from "zustand";
import { useAuthStore } from "./autStore";
import { useChatStore } from "./chatStore";

const ENDPOINT = "https://chat-app-backend-4hs0.onrender.com"

export const useMessageStore = create((set, get) => ({

  messages: [],
  sendMessage: async (data) => {
    try {
      const res = await axios.post(`${ENDPOINT}/api/message/`, data, { withCredentials: true });
      set({ messages: [...get().messages, res.data.message] })
      return res.data.message;
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Failed to send message"
      toast.error(err)
    }
  },
  getAllMessage: async (chatId) => {
    try {
      const res = await axios.get(`${ENDPOINT}/api/message/${chatId}`, { withCredentials: true });
      set({ messages: res.data.messages });
      return res.data.messages;
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Failed to load messages"
      toast.error(err)
    }
  },
  recieveMessage: async (message) => {
    set({ messages: [...get().messages, message] })
  }
}))