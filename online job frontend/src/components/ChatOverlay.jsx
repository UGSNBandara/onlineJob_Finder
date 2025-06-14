import { useState } from 'react'
import { useMessage } from '../context/MessageContext'

function ChatOverlay({ chat, onClose }) {
  const [newMessage, setNewMessage] = useState('')
  const { sendMessage } = useMessage()

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-company">
            <img src={chat?.companyLogo} alt={chat?.company} className="company-logo" />
            <h3>{chat?.company}</h3>
          </div>
          <button className="close-chat" onClick={onClose}>✕</button>
        </div>
        
        <div className="chat-messages">
          {chat?.messages?.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'message-user' : 'message-company'}`}
            >
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default ChatOverlay 