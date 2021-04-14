import React, {useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {useHistory, Switch, Route, useRouteMatch} from 'react-router-dom'
import {Button, Alert, Navbar, Form, Row, Col, Jumbotron} from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import DashboardMain from '../components/dashboard components/DashboardMain.js'
import AddNewPost from '../components/dashboard components/AddNewPost.js'
import Drafts from '../components/dashboard components/Drafts.js'
export default function Dashboard() {

    const {logout, currentUser} = useAuth()
    const [error, setError] = useState()
    const history = useHistory()
    const {path, url} = useRouteMatch()
    async function handleLogout(){
        setError('')
        try{
            await logout()
            history.push('/login')
        }catch{
            setError('Failed to Log out')
        }
    }
    const routes = () => [
        <Route 
        path={`${path}/posts/add-new-post`} 
        key={`${path}/posts/add-new-post`}
        render={()=>{<AddNewPost/>}}
        />,
        <Route 
        path={`${path}`} 
        key={`${path}`}
        render={()=>{<DashboardMain/>}}
        />  
    ]
    
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
                <Row>
                    <Jumbotron className="w-100"><h1>test</h1></Jumbotron>
                </Row>

                <Row>
                   <Switch>
                        
                    {routes()}
                      
                   </Switch>
                </Row>
               </Col>      
            </Row>
            {error&&<Alert variant="danger">{error}</Alert>} 
        </>
    )
}
