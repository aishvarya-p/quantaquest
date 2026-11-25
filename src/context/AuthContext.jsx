import { useState } from 'react';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../utils/authStorage';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  function register(details) {
    const result = registerUser(details);
    if (result.ok) {
      setCurrentUser(result.user);
    }
    return result;
  }

  function login(credentials) {
    const result = loginUser(credentials);
    if (result.ok) {
      setCurrentUser(result.user);
    }
    return result;
  }

  function logout() {
    logoutUser();
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
