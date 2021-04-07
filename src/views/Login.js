import React, {useState} from 'react'
import '../styles/login.css'

function Login () {

    const [credentials, setCredentials] = useState({})
    
function handleChange (event){
   if(event.target.name === 'username'){
     setCredentials({...credentials, username:event.target.value})  
   }
   else if(event.target.name === 'password'){
    setCredentials({...credentials, password:event.target.value})   
   }
}
function submitData(){
    return console.log(credentials)
}

    return(
        <div className="container">
           <div className="loginTab">
           
            <div className="content">
            <div className="logintitle"><h3>Admin Login</h3></div>
              <form>
                <div className="inputs">
                <label className="username">
                      username
                      <input type="text" value={credentials.username} onChange={handleChange} name="username"/>
                  </label>
                </div>
                <div className="inputs">
                <label className="password">
                    password
                    <input type="password" value={credentials.password} onChange={handleChange} name="password"/>
                    </label>
                </div>
                
                <div className="button">
                <input type="submit" value="Submit" onClick={submitData()}/>
                </div>
                
              </form>
                
            </div>
            
           </div>
        </div>
    )
}
export default Login