import { createContext, useContext, useState } from 'react'

const MessageContext = createContext()

export function MessageProvider({ children }) {
  const [messages] = useState([
    {
      id: 1,
      company: 'Tech Corp',
      companyLogo: '/temp_profile.jpg',
      lastMessage: 'Hi! Thanks for your interest. Could you tell me more about your experience?',
      messages: [
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
      ]
    },
    {
      id: 2,
      company: 'Design Studio',
      companyLogo: '/temp_profile.jpg',
      lastMessage: 'We would love to schedule an interview with you.',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'I have 5 years of experience in UX design.',
          timestamp: '2024-03-15T11:00:00'
        },
        {
          id: 2,
          sender: 'company',
          text: 'We would love to schedule an interview with you.',
          timestamp: '2024-03-15T11:05:00'
        }
      ]
    }
  ])

  const [selectedChat, setSelectedChat] = useState(null)
  const [showChat, setShowChat] = useState(false)

  const sendMessage = (text) => {
    if (selectedChat) {
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        text,
        timestamp: new Date().toISOString()
      }
      // In a real app, this would be an API call
      console.log('Sending message:', newMessage)
    }
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