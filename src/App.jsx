import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Navigate, Route, Routes, } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import './App.css'
import { useAuthStore } from './store/autStore.js'
import ChatPage from './pages/ChatPage.jsx'
import { ToastContainer } from 'react-toastify'

function App() {
  const { authUser } = useAuthStore()
  return (
    <div className="" >
      <Routes>
        <Route path={'/auth'} element={!authUser ? <HomePage /> : <Navigate to={'/'} />} />
        <Route path={'/'} element={authUser ? <ChatPage /> : <Navigate to={'/auth'} />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App
