import { useState, useEffect } from "react";
import { useSignup } from "../hooks/useSignup";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the signup function to register the user
    await signup(email, password);
    // If a profile picture is selected, save it to local storage
    if (profilePic) {
      saveProfilePicToLocalStorage(profilePic);
    }
  };

  useEffect(() => {
    if (error) {
      // Display signup error toast
      toast.error(error);
    }
  }, [error]);

  const handleFileChange = (e) => {
    // Set the selected file as the profile picture
    const file = e.target.files[0];
    setProfilePic(file);
  };

  const saveProfilePicToLocalStorage = (file) => {
    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Save the profile picture data as a data URL in local storage with the unique email as the key
      localStorage.setItem(email, event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <label>Email address:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <label>Profile Picture:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button disabled={isLoading}>Sign up</button>
      <ToastContainer />
    </form>
  );
};

export default Signup;
