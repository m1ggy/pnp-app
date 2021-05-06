import React, {useContext, useState, useEffect} from 'react'
import {firebaseAuth} from '../firebase/firebase'

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider ({children}){
const [currentUser, setCurrentUser] = useState()
const [loading, setLoading] = useState(true)
const [analyticsUser, setAnalyticsUser] = useState()
////login to firebase
function login (email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password)
}
function logout () {
    return firebaseAuth.signOut()
}

const initAuth = () => {
    return window.gapi.auth2.init({
      client_id: "85524057481-v3dfiav5emdp8vkfths4v7v6blul2fen.apps.googleusercontent.com", //paste your client ID here
      scope: "https://www.googleapis.com/auth/analytics.readonly",
    });
  };

const checkSignedIn = () => {
    return new Promise((resolve, reject) => {
      initAuth() //calls the previous function
        .then(() => {
          const auth = window.gapi.auth2.getAuthInstance(); //returns the GoogleAuth object
          resolve(auth.isSignedIn.get()); //returns whether the current user is currently signed in
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

const renderButton = () => {
    window.gapi.signin2.render("signin-button", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };
  
  const onSuccess = (googleUser) => {
   setAnalyticsUser(googleUser)
  };
  
  const onFailure = (error) => {
    console.error(error);
  };

///listen to changes in auth
useEffect(()=>{
    const unsubscribe = firebaseAuth.onAuthStateChanged(user =>{
        setCurrentUser(user)
        setLoading(false)
    })

    return unsubscribe
},[])

    const value = {
        currentUser,
        login,
        logout,
        checkSignedIn,
        renderButton,
        analyticsUser
    }
    return(
        <AuthContext.Provider value={value}>
            {!loading&&children}
        </AuthContext.Provider>
    )
}
