import { useMessage } from '../context/MessageContext'

function RightSidebar() {
  const { messages, setSelectedChat, setShowChat } = useMessage()

  return (
    <div className="right-sidebar">
      <h3>Messages</h3>
      <div className="message-list">
        {messages.map(message => (
          <div 
            key={message.id} 
            className="message-item"
            onClick={() => {
              setSelectedChat(message)
              setShowChat(true)
            }}
          >
            <div className="message-company">
              <img src={message.companyLogo} alt={message.company} className="company-logo" />
              <div>
                <h4>{message.company}</h4>
                <p>{message.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RightSidebar 