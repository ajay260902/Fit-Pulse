import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    // Load backend URL from environment variable
    setBackendUrl(process.env.REACT_APP_BACKEND_URL);
  }, []);

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    if (!backendUrl) {
      setError('Backend URL is not specified.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        // Save the user to local storage
        localStorage.setItem('user', JSON.stringify(json));

        // Update the auth context
        dispatch({ type: 'LOGIN', payload: json });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      // Update loading state
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
