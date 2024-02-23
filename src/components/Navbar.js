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
          <p>Stay Fit, Feel the Pulse</p>

        </Link>

        <nav>
          {user && (
            <>
              <div className="user-info">
                <div className="profile-pic" onClick={handleProfilePicClick}>
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="profile-img"
                    />
                  ) : (
                    <img
                      src="https://www.shareicon.net/data/512x512/2016/09/15/829472_man_512x512.png"
                      alt="Default Profile"
                      className="profile-img"
                    />
                  )}
                </div>
                <span className='username'>{user.email}</span>
              </div>

              <button className='btn' onClick={handleClick}>Log out</button>
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
