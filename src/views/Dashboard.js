import React, {useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {Button, Alert, Navbar, Form, Row, Col} from 'react-bootstrap'
import Sidebar from '../components/Sidebar'

export default function Dashboard() {

    const {logout, currentUser} = useAuth()
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
        <>     
                <Navbar>
                    <Form inline className="ml-3">
                        <Button onClick={handleLogout} variant="danger">Logout</Button>
                    </Form>   
                    {currentUser&&<text className="align-middle ml-2">{currentUser.email}</text>} 
                </Navbar>
           
           <Row>
               <Col sm={2}><Sidebar/></Col>
               <Col sm={10}>Content</Col>      
            </Row>
          
            {error&&<Alert variant="danger">{error}</Alert>}
            
        </>
    )
}
