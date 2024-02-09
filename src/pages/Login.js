import React, { useState,useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// import { forgotPassword } from "../api/userApi"; // Assuming you have an API function for forgot password

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false); // State to manage the visibility of the forgot password form
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error: loginError, isLoading: isLoginLoading } = useLogin();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  useEffect(() => {
    if (loginError) {
      // Display login error toast
      toast.error(loginError);
    }
  }, [loginError]);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Send a request to your backend to reset the password
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(
          {
            email: email,
            password: forgotPassword
          }
        ),
      });
      if (!response.ok) {
        // throw new Error('Failed to reset password');
        toast.error('Failed to reset password');
      }
      toast.success('Password reset successfully');
    
      setShowForgotPasswordForm(false)
      setPassword('')
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    }

    setIsLoading(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordForm(true);
    setPassword('')
  };

  return (
    <div>
      {/* Conditional rendering: Display either the Login form or the Forgot Password form based on showForgotPasswordForm state */}
      {showForgotPasswordForm ? (
        // Forgot Password Form
        <form className="login" onSubmit={handleForgotPasswordSubmit}>
          <h3>Forgot Password</h3>

          <label>Email address:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setForgotPassword(e.target.value)}
            value={forgotPassword}
          />

          <button type="submit">Reset Password</button>
        </form>
      ) : (
        // Login Form
        <form className="login" onSubmit={handleLoginSubmit}>
          <h3>Log In</h3>

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

          {/* Forgot Password Link */}
          <div style={{ marginBottom: '10px' }}>
            <a onClick={handleForgotPasswordClick} style={{ cursor: 'pointer',fontSize:'small' }}>Forgot Password?</a>
          </div>
          <button disabled={isLoading}>Log in</button>

        </form>

      )}
        <ToastContainer />
    </div>
  );
};

export default Login;
