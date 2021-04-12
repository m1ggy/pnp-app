import React from 'react'
import {Col, Row, Container, NavDropdown} from 'react-bootstrap'

export default function Sidebar() {
    return (
        <Container>
            <Col>
                <Row>
                    Dashboard
                </Row>
                <Row>
                <NavDropdown title="Posts" id="basic-nav-dropdown" drop="right">
                    <NavDropdown.Item>Add New Post</NavDropdown.Item>
                    <NavDropdown.Item>Drafts</NavDropdown.Item>
                    <NavDropdown.Item>Published</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>Manage Post</NavDropdown.Item>
                </NavDropdown>
                </Row>
            </Col>
        </Container>
    )
}
