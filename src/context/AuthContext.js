import { createContext, useReducer, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
      const decodedToken = jwtDecode(user.token); // Decode the JWT
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decodedToken.exp < currentTime) {
        // Token is expired
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('user'); // Remove user from local storage
      } else {
        // Token is valid
        dispatch({ type: 'LOGIN', payload: user });
      }
    }
  }, []);

  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}
