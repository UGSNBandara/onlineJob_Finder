import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import LeftSidebar from '../components/LeftSidebar'
import RightSidebar from '../components/RightSidebar'
import ChatOverlay from '../components/ChatOverlay'
import { useMessage } from '../context/MessageContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'

function MainLayout() {
  const { selectedChat, showChat, setShowChat } = useMessage()  
  const { isLoggedIn, showAuthModal } = useAuth()

  return (
    <div className="main-layout">
      <Header />
      <div className={`content-wrapper ${showAuthModal ? 'blurred' : ''}`}>
        <div className="main-container">
          <aside className="left-sidebar">
            <LeftSidebar />
          </aside>
          <main className="main-content">
            <Outlet />
          </main>
          <aside className="right-sidebar">
            <RightSidebar />
          </aside>
        </div>
        {showChat && selectedChat && (
          <ChatOverlay 
            chat={selectedChat} 
            onClose={() => setShowChat(false)} 
          />
        )}
      </div>
      {showAuthModal && <AuthModal />}
    </div>
  )
}

export default MainLayout 