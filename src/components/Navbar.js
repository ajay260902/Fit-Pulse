import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>FitPulse</h1>
        </Link>
          <p>Stay Fit, Feel the Pulse</p>
        
        <nav>
          
          {user && (
            <div>
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
             <button className='btn'><Link to="/login">Login</Link></button> 
             <button className='btn'><Link to="/signup">Signup</Link></button> 
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar