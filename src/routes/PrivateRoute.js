import React from 'react'
import {Redirect, Route, useHistory} from 'react-router-dom'
import {useAuth } from '../contexts/AuthContext'



export default function PrivateRoute({component:Component, ...rest}) {

    const { currentUser } = useAuth()
    const history = useHistory()

    // function HandleRedirect(){
    //     return history.push({pathname:'/login', message:"Please log in to access this page."})
    // }
    return (
        <Route{...rest}
        render={props =>{
            return currentUser? <Component {...props}/>:history.push({pathname:'/login', message:"Please log in to access this page."})
        }}
        >
        </Route>
    )
}
