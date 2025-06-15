import { useMessage } from '../context/MessageContext'

function RightSidebar() {
  const { messages, setSelectedChat, setShowChat } = useMessage()

  return (
    <div className="right-sidebar">
      <h3>Messages</h3>
      <div className="message-list">
        {messages.length === 0 ? (
          <p className="no-chats">No messages yet</p>
        ) : (
          messages.map(chat => (
            <div 
              key={chat.id} 
              className="message-item"
              onClick={() => {
                setSelectedChat(chat)
                setShowChat(true)
              }}
            >
              <div className="message-company">
                <img src={chat.companyLogo} alt={chat.company} className="company-logo" />
                <div>
                  <h4>{chat.company}</h4>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RightSidebar 