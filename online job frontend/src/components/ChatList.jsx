import { useMessage } from '../context/MessageContext'

function ChatList({ onSelectChat }) {
  const { messages } = useMessage()

  return (
    <div className="chat-list">
      <h3>Messages</h3>
      {messages.length === 0 ? (
        <p className="no-chats">No messages yet</p>
      ) : (
        messages.map(chat => (
          <div 
            key={chat.id} 
            className="chat-item"
            onClick={() => onSelectChat(chat)}
          >
            <img src={chat.companyLogo} alt={chat.company} className="company-logo" />
            <div className="chat-info">
              <h4>{chat.company}</h4>
              <p className="last-message">{chat.text}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ChatList 