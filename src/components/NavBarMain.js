import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Row, Image } from 'react-bootstrap';
import '../styles/navbar.css';

function NavBarMain() {
  return (
    <Navbar expand='lg' fixed='top' className='bg-light'>
      <NavLink to='/'>
        <Navbar.Brand>
          <Image
            style={{
              width: 20,
              height: '100%',
              imageRendering: 'auto',
            }}
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Philippine_National_Police_seal.svg/1200px-Philippine_National_Police_seal.svg.png'
          />{' '}
          <Navbar.Text style={{ color: 'black' }}>
            Philippine National Police
          </Navbar.Text>
        </Navbar.Brand>
      </NavLink>
      <Navbar.Toggle aria-controls='nav' />
      <Navbar.Collapse id='nav'>
        <Nav className='m-auto' style={{ width: '90%' }}>
          <Row
            className='m-auto w-100'
            style={{
              display: 'flex',
              textAlign: 'center',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <NavLink
              to='/home'
              className='listNavBarItem col-lg-2'
              activeClassName='listNavBarItemActive'
            >
              Home
            </NavLink>

            <NavLink
              to='/maps'
              className='listNavBarItem col-lg-2'
              activeClassName='listNavBarItemActive'
            >
              Map
            </NavLink>

            <NavLink
              to='/news-and-events'
              className='listNavBarItem col-lg-2'
              activeClassName='listNavBarItemActive'
            >
              News and Events
            </NavLink>

            <NavLink
              to='/downloads'
              className='listNavBarItem col-lg-2'
              activeClassName='listNavBarItemActive'
            >
              Downloads
            </NavLink>

            <NavLink
              to='/gallery'
              className='listNavBarItem col-lg-2'
              activeClassName='listNavBarItemActive'
            >
              Gallery
            </NavLink>

            <NavLink
              to='/contact'
              className='listNavBarItem col-lg-2'
              activeClassName='listNavBarItemActive'
            >
              Contact
            </NavLink>
          </Row>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBarMain;
