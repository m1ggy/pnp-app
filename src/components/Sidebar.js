import React from 'react';
import { Row, NavDropdown, Jumbotron, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/sidebar.css';

export default function Sidebar() {
  const user = useSelector((state) => state.userReducer.user);

  return (
    <div>
      <Jumbotron className='border p-5 ' style={{ zIndex: 999 }}>
        <h5>Navigation</h5>
        <Nav className='flex-column'>
          <Row className='mt-3'>
            <Link to={`/dashboard`}>Dashboard</Link>
          </Row>

          <Row className='mt-3'>
            <NavDropdown title='Posts' id='basic-nav-dropdown' drop='right'>
              <NavDropdown.Item>
                <Link to='/dashboard/posts/manage-posts'>Manage Posts</Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                {' '}
                <Link to='/dashboard/posts/add-new-post'>Add New Post</Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to='/dashboard/posts/drafts'>Drafts</Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Row>
          <Row>
            <NavDropdown
              title='Announcements'
              id='basic-nav-dropdown'
              drop='right'
            >
              <NavDropdown.Item>
                <Link to='/dashboard/announcement/manage-announcements'>
                  Manage Announcements
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                {' '}
                <Link to='/dashboard/announcement/add-new-announcement'>
                  Add New Announcement
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Row>

          <Row className='mt-3'>
            <NavDropdown title='Downloads' id='basic-nav-dropdown' drop='right'>
              <NavDropdown.Item>
                <Link to='/dashboard/downloads/manage-downloads'>
                  Manage Downloads
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Link to='/dashboard/downloads/add-new-download'>
                  Add New Download
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Row>

          <Row className='mt-3'>
            <NavDropdown title='Galleries' id='basic-nav-dropdown' drop='right'>
              <NavDropdown.Item>
                <Link to='/dashboard/gallery/manage-galleries'>
                  Manage Galleries
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Link to='/dashboard/gallery/add-new-gallery'>
                  Add New Gallery
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Row>
          <Row className='mt-3'>
            <Link to='/dashboard/charts'>Charts</Link>
          </Row>
          {user.role === 'SA' ? (
            <Row className='mt-3'>
              <Link to='/dashboard/account'>Accounts</Link>
            </Row>
          ) : null}
        </Nav>
      </Jumbotron>
    </div>
  );
}
