import React from 'react'
import {Col, Row, NavDropdown} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import '../styles/sidebar.css'
export default function Sidebar() {
    return (
        <div className="sidebarContainer border h-100 d-inline-block bg-light pl-5">
            <Col>
                <Row className="mt-3">
                    <Link>Dashboard</Link>
                </Row>
                <Row className="mt-3">
                <NavDropdown title="Posts" id="basic-nav-dropdown" drop="right">
                    <NavDropdown.Item href="#add-new-post">Add New Post</NavDropdown.Item>
                    <NavDropdown.Item href="#drafts">Drafts</NavDropdown.Item>
                    <NavDropdown.Item href="#published">Published</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#manage-posts">Manage Posts</NavDropdown.Item>
                </NavDropdown>
                </Row>
                <Row className="mt-3">
                <NavDropdown title="Downloads" id="basic-nav-dropdown" drop="right">
                    <NavDropdown.Item href="#view-downloads">View Downloads</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#manage-downloads">Manage Downloads</NavDropdown.Item>
                </NavDropdown>
                </Row>
                <Row className="mt-3">
                <Link to="#map">Map</Link>
                </Row>
                <Row className="mt-3">
                <Link to="#charts">Charts</Link>
                </Row>
                <Row className="mt-3">
                <Link to="#accounts">Accounts</Link>
                </Row>
            </Col>
        </div>
    )
}
