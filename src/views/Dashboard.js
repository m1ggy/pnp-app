import React, {useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {Button, Alert, Container, Navbar, Form, Row, Col} from 'react-bootstrap'
import Sidebar from '../components/Sidebar'

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
        <Container>
            <Navbar>
               <Form inline>
                   <Button onClick={handleLogout} variant="danger">Logout</Button>
               </Form>
            </Navbar>
           <Row>
               <Col><Sidebar/></Col>
               <Col>Content</Col>      
            </Row>
          
            {error&&<Alert variant="danger">{error}</Alert>}
            
        </Container>
    )
}
