import React, {useState, useRef} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {Button, Alert, Navbar, Form, Row, Col, Jumbotron} from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import ContentDashboard from '../components/ContentDashboard'

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
        
            <Navbar className="bg-light mb-3">
                <Form inline className="ml-3">
                    <Button onClick={handleLogout} variant="danger">Logout</Button>
                </Form>   
                {currentUser&&<text className="align-middle ml-2">{currentUser.email}</text>} 
            </Navbar>
                
           
           <Row>
               <Col md="auto">
                <Sidebar/>
               </Col>
               <Col>
                <Row><Jumbotron className="w-100"><h1>test</h1></Jumbotron></Row>
                <Row>test</Row>
               </Col>      
            </Row>
          
            {error&&<Alert variant="danger">{error}</Alert>}
            
        </>
    )
}
