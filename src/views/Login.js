import React, {useState,useRef} from 'react'
import '../styles/login.css'
import {useAuth} from '../contexts/AuthContext'
import {Alert} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

function Login () {
  const emailRef = useRef()
  const passwordRef = useRef()
  const {login} = useAuth()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e){
    e.preventDefault()
    try{
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push('/dashboard')
    }catch{   
        setError("Failed to Login. email or password is incorrect.")
    } 
    setLoading(false)
  }
  
    return(
        <div className="container">
           <div className="loginTab">
           
            <div className="content">
            <div className="logintitle"><h3>Admin Login</h3></div>
              <form>
                <div className="inputs">
                <label className="username">
                      email
                      <br/>
                      <input type="text" ref={emailRef} required/>
                  </label>
                </div>
                <div className="inputs">
                <label  className="password">
                    password
                    <br/>
                    <input type="password" ref={passwordRef} required/>
                    </label>
                </div>
                
                <div className="btn">
                <input type="submit" value="Submit" onClick={handleSubmit} className="button" disabled={loading}/>
                </div>
                
              </form>
                {error&&<Alert variant="danger">{error}</Alert>}
            </div>
            
           </div>
        </div>
    )
}
export default Login