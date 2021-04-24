import React from 'react'
import {Col, Row, NavDropdown} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import '../styles/sidebar.css'
export default function Sidebar() {
   
    return (
        <div className="sidebarContainer border bg-light pl-5 pb-5">
            <Col>
           
                <Row className="mt-3">
                    <Link to={`/dashboard`}>Dashboard</Link>
                </Row>
                
                <Row className="mt-3">

                    <NavDropdown title="Posts" id="basic-nav-dropdown" drop="right">

                        <NavDropdown.Item><Link to='/dashboard/posts/manage-posts'>Manage Posts</Link></NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item> <Link to='/dashboard/posts/add-new-post'>Add New Post</Link></NavDropdown.Item>
                        <NavDropdown.Item><Link to='/dashboard/posts/drafts'>Drafts</Link></NavDropdown.Item>
                     </NavDropdown>

                </Row>

                <Row className="mt-3">

                    <NavDropdown title="Downloads" id="basic-nav-dropdown" drop="right">
                        
                        <NavDropdown.Item><Link to="/dashboard/downloads/manage-downloads">Manage Downloads</Link></NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item><Link to="/dashboard/downloads/add-new-download">Add New Download</Link></NavDropdown.Item>
                       
                    </NavDropdown>

                </Row>

                <Row className="mt-3">

                    <NavDropdown title="Galleries" id="basic-nav-dropdown" drop="right">

                        <NavDropdown.Item><Link to="/dashboard/gallery/manage-galleries">Manage Galleries</Link></NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item><Link to="/dashboard/gallery/add-new-gallery">Add New Gallery</Link></NavDropdown.Item>

                    </NavDropdown>

                </Row>
                <Row className="mt-3">
                <Link to="/dashboard/map">Map</Link>
                </Row>
                <Row className="mt-3">
                <Link to="/dashboard/charts">Charts</Link>
                </Row>
                <Row className="mt-3">
                <Link to="/dashboard/account">Account</Link>
                </Row>
                
            </Col>
        </div>
    )
}
