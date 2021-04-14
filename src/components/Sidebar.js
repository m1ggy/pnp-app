import React from 'react'
import {Col, Row, NavDropdown} from 'react-bootstrap'
import {Link, BrowserRouter as Router} from 'react-router-dom'
import '../styles/sidebar.css'
export default function Sidebar() {
    return (
        <div className="sidebarContainer border h-100 d-inline-block bg-light pl-5">
            <Col>
            <Router basename="/dashboard">
                <Row className="mt-3">
                    <Link to="/">Dashboard</Link>
                </Row>
                
                <Row className="mt-3">
                <NavDropdown title="Posts" id="basic-nav-dropdown" drop="right">
                    <NavDropdown.Item><Link to="/add-new-post">Add New Post</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/drafts">Drafts</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/published">Published</Link></NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item><Link to="/manage-posts">Manage Posts</Link></NavDropdown.Item>
                </NavDropdown>
                </Row>
                <Row className="mt-3">
                <NavDropdown title="Downloads" id="basic-nav-dropdown" drop="right">
                    <NavDropdown.Item><Link to="/view-downloads">View Downloads</Link></NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item><Link to="/manage-downloads">Manage Downloads</Link></NavDropdown.Item>
                </NavDropdown>
                </Row>
                <Row className="mt-3">
                <Link to="/map">Map</Link>
                </Row>
                <Row className="mt-3">
                <Link to="/charts">Charts</Link>
                </Row>
                <Row className="mt-3">
                <Link to="/accounts">Accounts</Link>
                </Row>
                </Router>
            </Col>
        </div>
    )
}
