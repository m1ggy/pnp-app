import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import '../styles/navbar.css';

function NavBarMain() {
  return (
    <div>
      <Navbar expand='lg' fixed='top' className='navBorder'>
        <NavLink to='/'>
          <Navbar.Brand>
            <img
              width='35px'
              height='45px'
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Philippine_National_Police_seal.svg/1200px-Philippine_National_Police_seal.svg.png'
              alt='PNP Logo'
              className='d-inline-block align-top'
              style={{ display: 'block' }}
            />{' '}
            <Navbar.Text style={{ color: 'black' }}>
              Philippine National Police
            </Navbar.Text>
          </Navbar.Brand>
        </NavLink>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
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
    </div>
  );
}

export default NavBarMain;
