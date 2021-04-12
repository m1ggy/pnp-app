import React from 'react'
import {Col, Row, NavDropdown} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import '../styles/sidebar.css'
export default function Sidebar() {
    return (
        <div className="sidebarContainer border h-100 d-inline-block bg-light">
            <Col>
                <Row className="mt-3">
                    <Link>Dashboard</Link>
                </Row>
                <Row className="mt-3">
                <NavDropdown title="Posts" id="basic-nav-dropdown" drop="right">
                    <NavDropdown.Item>Add New Post</NavDropdown.Item>
                    <NavDropdown.Item>Drafts</NavDropdown.Item>
                    <NavDropdown.Item>Published</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>Manage Post</NavDropdown.Item>
                </NavDropdown>
                </Row>
                <Row className="mt-3">
                <NavDropdown title="Downloads" id="basic-nav-dropdown" drop="right">
                    <NavDropdown.Item>View Downloads</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>Manage Downloads</NavDropdown.Item>
                </NavDropdown>
                </Row>
                <Row className="mt-3">
                <Link>Map</Link>
                </Row>
                <Row className="mt-3">
                <Link>Charts</Link>
                </Row>
                <Row className="mt-3">
                <Link>Accounts</Link>
                </Row>
            </Col>
        </div>
    )
}
