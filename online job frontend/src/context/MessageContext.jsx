import { createContext, useContext, useState } from 'react'

const MessageContext = createContext()

export function MessageProvider({ children }) {
  const [messages] = useState([
    {
      id: 1,
      sender: 'user',
      text: "Hello, I'm interested in the position",
      timestamp: '2024-03-15T10:00:00'
    },
    {
      id: 2,
      sender: 'company',
      text: 'Hi! Thanks for your interest. Could you tell me more about your experience?',
      timestamp: '2024-03-15T10:05:00'
    }
  ])

  const [selectedChat, setSelectedChat] = useState(null)
  const [showChat, setShowChat] = useState(false)

  const sendMessage = (text) => {
    // This will be implemented later
    console.log('Sending message:', text)
  }

  return (
    <MessageContext.Provider value={{
      messages,
      selectedChat,
      setSelectedChat,
      showChat,
      setShowChat,
      sendMessage
    }}>
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