import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="site-name">JobConnect</Link>
      <div className="motivation-text">Find Your Dream Job Today!</div>
    </header>
  )
}

export default Header 