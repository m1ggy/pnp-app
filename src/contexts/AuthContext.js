import React, { useContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../firebase/firebase';
import { setUser } from '../redux/usersSlice';
import { useDispatch } from 'react-redux';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  ////login to firebase
  function login(email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password);
  }
  function logout() {
    dispatch(setUser(''));
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
