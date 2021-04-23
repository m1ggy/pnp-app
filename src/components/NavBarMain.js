import React from 'react'
import { Link } from 'react-router-dom'
import {Navbar, Nav} from 'react-bootstrap'
import '../styles/navbar.css'

function NavBarMain (){
    return (
       
            <Navbar bg="light" expand="lg" fixed="top">
                <Navbar.Brand>
                <img
                width="30px"
                height="35px"
                   src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Philippine_National_Police_seal.svg/1200px-Philippine_National_Police_seal.svg.png' alt="PNP Logo"
                    className="d-inline-block align-top"
                    style={{display:'block'}}
                />{' '}
               Philippine National Police
                </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="m-auto">
                <Nav.Link>
                    <Link to='/home' className="listNavBarItem" activeClassName="listNavBarActive">Home</Link> 
                </Nav.Link>
                <Nav.Link>
                    <Link to='/maps' className="listNavBarItem" activeClassName="listNavBarActive">Map</Link>
                </Nav.Link>              
                 <Nav.Link>
                    <Link to='/news-and-events' className="listNavBarItem" activeClassName="listNavBarActive">News and Events</Link>
                </Nav.Link>              
                <Nav.Link>
                    <Link to='/downloads' className="listNavBarItem" activeClassName="listNavBarActive">Downloads</Link>
                </Nav.Link>              
                <Nav.Link>
                    <Link to='/gallery' className="listNavBarItem" activeClassName="listNavBarActive">Gallery</Link>
                </Nav.Link>               
                <Nav.Link>
                    <Link to='/contact' className="listNavBarItem" activeClassName="listNavBarActive">Contact</Link>
                </Nav.Link>
               
            </Nav>
            </Navbar.Collapse>  
            </Navbar>    
               
    )
}

export default NavBarMain;