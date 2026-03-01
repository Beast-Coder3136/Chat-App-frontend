import { create } from 'zustand'
import { persist } from "zustand/middleware";
import axios from 'axios'
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const ENDPOINT = "https://chat-app-backend-4hs0.onrender.com"

export const useAuthStore = create(persist((set, get) => ({
  authUser: null,
  isLogingIn: false,
  isSigningUp: false,
  users: [],
  notification: [],
  socket: null,
  onlineUser: [],
  isTyping : false,

  login: async (data) => {
    set({ isLogingIn: true })
    try {
      const res = await axios.post(`${ENDPOINT}/api/user/login`, data, { withCredentials: true });
      set({ authUser: res.data.user });
      toast.success("You are now logged in")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)

    }
    finally {
      set({ isLogingIn: false });
    }
  },
  signUp: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axios.post(`${ENDPOINT}/api/user/signup`, data, {
        withCredentials: true, 
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      set({ authUser: res.data.user });
      toast.success("SignIn successfull")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)
    }
    finally {
      set({ isSigningUp: false })
    }
  },

  searchUser: async (query) => {
    try {
      const res = await axios.get(`${ENDPOINT}/api/user?search=${query}`, { withCredentials: true });
      set({ users: res.data.users });
    } catch (error) {
      console.log(error.response.data.message)
    }
  },

  logout: async () => {
    try {
      const res = await axios.post(`${ENDPOINT}/api/user/logout`, {}, { withCredentials: true });
      toast.success("Logout Successfully")
    } catch (error) {
      let err = error?.response?.data?.message ? error?.response?.data?.message : "Somethin went wrong"
      toast.error(err)
    }
    finally {
      get().socket.disconnect();
      set({
        authUser: null,
        socket: null,
        onlineUser: [],
        notification: []
      });
      useAuthStore.persist.clearStorage()
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(ENDPOINT);
    socket.emit("setup", authUser);
    socket.on("connected", () => set({ socket: socket }));
    socket.on("online-users", (online) => set({ onlineUser: online }))
    socket.on("typing", () => set({ isTyping : true  }));
    socket.on("stop-typing", () => set({ isTyping : false  }));
  },
  setNotification: (notif) => {
    set({ notification: notif });
  },
  setUsers: (users) => {
    set({ users: users })
  }
}),
  {
    name: "userData",
    partialize: (state) => ({
      authUser: (state.authUser)
    })
  }
)
)
