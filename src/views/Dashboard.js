import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom';
import { Button, Alert, Navbar, Form, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import DashboardMain from '../components/dashboard components/DashboardMain';
import AddNewPost from '../components/dashboard components/AddNewPost';
import Drafts from '../components/dashboard components/Drafts';
import ManagePost from '../components/dashboard components/ManagePost';
import ManageDownloads from '../components/dashboard components/ManageDownloads';
import MapsMain from '../components/dashboard components/MapsMain';
import ChartsMain from '../components/dashboard components/ChartsMain';
import AccountsMain from '../components/dashboard components/AccountsMain';
import ManageGalleries from '../components/dashboard components/ManageGalleries';
import AddNewGallery from '../components/dashboard components/AddNewGallery';
import AddNewDownload from '../components/dashboard components/AddNewDownload';
import ManageAnnouncement from '../components/dashboard components/ManageAnnouncement';
import AddNewAnnouncement from '../components/dashboard components/AddNewAnnouncement';

export default function Dashboard() {
  const { logout, currentUser } = useAuth();
  const [error, setError] = useState();
  const history = useHistory();
  const { path } = useRouteMatch();
  async function handleLogout() {
    setError('');
    try {
      await logout();
      window.gapi.auth2.getAuthInstance().disconnect();
      history.push('/login');
    } catch {
      setError('Failed to Log out');
    }
  }

  ///routes for sidebar
  const routes = () => [
    <Route
      path={`${path}/account`}
      key={`${path}/account`}
      render={() => <AccountsMain />}
    />,
    <Route
      path={`${path}/charts`}
      key={`${path}/charts`}
      render={() => <ChartsMain />}
    />,
    <Route
      path={`${path}/map`}
      key={`${path}/map`}
      render={() => <MapsMain />}
    />,
    <Route
      path={`${path}/downloads/add-new-download`}
      key={`${path}/downloads/add-new-download`}
      render={() => <AddNewDownload />}
    />,
    <Route
      path={`${path}/downloads/manage-downloads`}
      key={`${path}/downloads/manage-downloads`}
      render={() => <ManageDownloads />}
    />,
    <Route
      path={`${path}/posts/manage-posts`}
      key={`${path}/posts/manage-posts`}
      render={() => <ManagePost />}
    />,
    <Route
      path={`${path}/posts/add-new-post`}
      key={`${path}/posts/add-new-post`}
      render={() => <AddNewPost />}
    />,
    <Route
      path={`${path}/announcement/manage-announcements`}
      key={`${path}/announcement/manage-announcements`}
      render={() => <ManageAnnouncement />}
    />,
    <Route
      path={`${path}/announcement/add-new-announcement`}
      key={`${path}/announcement/add-new-announcement`}
      render={() => <AddNewAnnouncement />}
    />,
    <Route
      path={`${path}/posts/drafts`}
      key={`${path}/posts/drafts`}
      render={() => <Drafts />}
    />,
    <Route
      path={`${path}/gallery/manage-galleries`}
      key={`${path}/gallery/manage-galleries`}
      render={() => <ManageGalleries />}
    />,
    <Route
      path={`${path}/gallery/add-new-gallery`}
      key={`${path}/gallery/add-new-gallery`}
      render={() => <AddNewGallery />}
    />,
    <Route path={`${path}`} key={`${path}`} render={() => <DashboardMain />} />,
  ];

  return (
    <>
      <Navbar className='bg-light mb-3'>
        <Form inline className='ml-3'>
          <Button onClick={handleLogout} variant='danger'>
            Logout
          </Button>
        </Form>
        {currentUser && (
          <p className='align-middle ml-2'>{currentUser.email}</p>
        )}
      </Navbar>

      <Row>
        <Col md='auto'>
          <Sidebar />
        </Col>

        <Col>
          <Row>
            <Switch>{routes()}</Switch>
          </Row>
        </Col>
      </Row>
      {error && <Alert variant='danger'>{error}</Alert>}
    </>
  );
}
