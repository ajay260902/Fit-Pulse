import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [profilePic, setProfilePic] = useState('');

  const handleClick = () => {
    logout();
  }

  const handleProfilePicClick = () => {
    // Open file input dialog to let the user select a new profile picture
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleFileChange;
    fileInput.click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // Set the new profile picture in local storage
      localStorage.setItem(user.email, reader.result);
      // Update state to reflect the new profile picture
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    // Retrieve profile picture from local storage
    if (user) {
      const storedProfilePic = localStorage.getItem(user.email);
      if (storedProfilePic) {
        setProfilePic(storedProfilePic);
      }
    }
  }, [user]);

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>FitPulse</h1>
        </Link>
        <p>Stay Fit, Feel the Pulse</p>

        <nav>
          {user && (
            <>
              <div className="user-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  onClick={handleProfilePicClick}
                  style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', border: '2px solid #ccc', marginBottom: 5 }}
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                     
                    />
                  ) : (
                    <img
                      src="https://www.shareicon.net/data/512x512/2016/09/15/829472_man_512x512.png" // Path to your default profile picture
                      alt="Default Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                      
                    />
                  )}

                </div>
                <span>{user.email}</span>
              </div>
              <button onClick={handleClick}>Log out</button>
            </>
          )}
          {!user && (
            <div>
              <Link to="/login"><button className='btn'>Login</button></Link>
              <Link to="/signup"><button className='btn'>Signup</button></Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
