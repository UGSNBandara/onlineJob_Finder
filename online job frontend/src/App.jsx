import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MessageProvider } from './context/MessageContext'
import AuthModal from './components/AuthModal'
import AuthButton from './components/AuthButton'

// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import HomePage from './pages/HomePage'
import UserProfilePage from './pages/UserProfilePage'
import CompanyProfilePage from './pages/CompanyProfilePage'

import './styles/auth.css'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <MessageProvider>
          <div className="app">
            <AuthButton />
            <AuthModal />
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="profile/user/:userId" element={<UserProfilePage />} />
                <Route path="profile/company/:companyId" element={<CompanyProfilePage />} />
              </Route>
            </Routes>
          </div>
        </MessageProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
