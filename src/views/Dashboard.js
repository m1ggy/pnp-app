import React, {useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {useHistory, Switch, Route, useRouteMatch} from 'react-router-dom'
import {Button, Alert, Navbar, Form, Row, Col} from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import DashboardMain from '../components/dashboard components/DashboardMain'
import AddNewPost from '../components/dashboard components/AddNewPost'
import Drafts from '../components/dashboard components/Drafts'
import Published from '../components/dashboard components/Published'
import ManagePost from "../components/dashboard components/ManagePost";
import ManageDownloads from '../components/dashboard components/ManageDownloads'
import DownloadsMain from '../components/dashboard components/DownloadsMain'
import MapsMain from '../components/dashboard components/MapsMain'
import ChartsMain from '../components/dashboard components/ChartsMain'
import AccountsMain from '../components/dashboard components/AccountsMain'
import ManageGalleries from '../components/dashboard components/ManageGalleries'
import AddNewGallery from '../components/dashboard components/AddNewGallery'

export default function Dashboard() {

    const {logout, currentUser} = useAuth()
    const [error, setError] = useState()
    const history = useHistory()
    const {path} = useRouteMatch()
    async function handleLogout(){
        setError('')
        try{
            await logout()
            history.push('/login')
        }catch{
            setError('Failed to Log out')
        }
    }


    ///routes for sidebar
    const routes = () => [
        <Route 
        path={`${path}/account`} 
        key={`${path}/account`}
        render={()=><AccountsMain/>}
        />,
        <Route 
        path={`${path}/charts`} 
        key={`${path}/charts`}
        render={()=><ChartsMain/>}
        />,
        <Route 
        path={`${path}/map`} 
        key={`${path}/map`}
        render={()=><MapsMain/>}
        />,
        <Route 
        path={`${path}/downloads/view-downloads`} 
        key={`${path}/downloads/view-downloads`}
        render={()=><DownloadsMain/>}
        />,
        <Route 
        path={`${path}/downloads/manage-downloads`} 
        key={`${path}/downloads/manage-downloads`}
        render={()=><ManageDownloads/>}
        />,
        <Route 
        path={`${path}/posts/manage-posts`} 
        key={`${path}/posts/manage-posts`}
        render={()=><ManagePost/>}
        />,
        <Route 
        path={`${path}/posts/published`} 
        key={`${path}/posts/published`}
        render={()=><Published/>}
        />,
        <Route 
        path={`${path}/posts/add-new-post`} 
        key={`${path}/posts/add-new-post`}
        render={()=><AddNewPost/>}
        />,
        <Route 
        path={`${path}/posts/drafts`} 
        key={`${path}/posts/drafts`}
        render={()=><Drafts/>}
        />,
        <Route 
        path={`${path}/gallery/manage-galleries`} 
        key={`${path}/gallery/manage-galleries`}
        render={()=><ManageGalleries/>}
        />,
        <Route 
        path={`${path}/gallery/add-new-gallery`} 
        key={`${path}/gallery/add-new-gallery`}
        render={()=><AddNewGallery/>}    
        />, 
        <Route 
        path={`${path}`} 
        key={`${path}`}
        render={()=><DashboardMain/>}
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
