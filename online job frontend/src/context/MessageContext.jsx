import { createContext, useContext, useState } from 'react'

const MessageContext = createContext()

export function MessageProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState(null)
  const [showChat, setShowChat] = useState(false)

  const selectChat = (chat) => {
    console.log('Selecting chat:', chat)
    setSelectedChat(chat)
    setShowChat(true)
  }

  return (
    <MessageContext.Provider
      value={{
        selectedChat,
        showChat,
        setShowChat,
        selectChat,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export function useMessage() {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider')
  }
  return context
} 