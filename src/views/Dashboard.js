import React, {useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {Button, Alert} from 'react-bootstrap'

export default function Dashboard() {

    const {logout} = useAuth()
    const [error, setError] = useState()
    const history = useHistory()

    async function handleLogout(){
        setError('')
        try{
            await logout()
            history.push('/login')
        }catch{
            setError('Failed to Log out')
        }
    }
    return (
        <div>
            Dashboard 
            <Button onClick={handleLogout} variant="link">
            Logout
            </Button>
            {error&&<Alert variant="danger">{error}</Alert>}
            
        </div>
    )
}
