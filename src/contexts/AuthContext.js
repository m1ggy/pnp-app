import React, { useContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../firebase/firebase';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  ////login to firebase
  function login(email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password);
  }
  function logout() {
    return firebaseAuth.signOut();
  }

  ///listen to changes in auth
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
