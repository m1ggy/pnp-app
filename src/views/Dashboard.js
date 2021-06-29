import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom';
import { Button, Alert, Navbar, Form, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import DashboardMain from '../components/dashboard components/DashboardMain';
import AddNewPost from '../components/dashboard components/AddNewPost';
import Drafts from '../components/dashboard components/Drafts';
import ManagePost from '../components/dashboard components/ManagePost';
import ManageDownloads from '../components/dashboard components/ManageDownloads';
import ChartsMain from '../components/dashboard components/ChartsMain';
import AccountsMain from '../components/dashboard components/AccountsMain';
import ManageGalleries from '../components/dashboard components/ManageGalleries';
import AddNewGallery from '../components/dashboard components/AddNewGallery';
import AddNewDownload from '../components/dashboard components/AddNewDownload';
import ManageAnnouncement from '../components/dashboard components/ManageAnnouncement';
import AddNewAnnouncement from '../components/dashboard components/AddNewAnnouncement';
import ReportsMain from '../components/dashboard components/ReportsMain';
import AddNewReport from '../components/dashboard components/AddNewReport';
import Map from '../components/Map';
import LogoutModal from '../components/LogoutModal';

export default function Dashboard() {
  const { logout } = useAuth();
  const [error, setError] = useState();
  const history = useHistory();
  const { path } = useRouteMatch();
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.userReducer.user);
  // const renders = useRef(0);

  const toggleModal = useCallback(() => {
    setShowModal((n) => (n = !n));
  }, [setShowModal]);

  const setErrors = useCallback(
    (string) => {
      setError((a) => (a = string));
    },
    [setError]
  );

  const handleLogout = useCallback(() => {
    setErrors('');
    logout()
      .then(() => {
        history.push({
          pathname: '/login',
        });
      })
      .catch(() => {
        setErrors('Failed to Log out');
      });
    toggleModal();
  }, [toggleModal, logout, history, setErrors]);

  ///routes for dashboard
  const routes = () => [
    user.role === 'SA' && (
      <Route
        path={`${path}/account`}
        key={`${path}/account`}
        render={() => <AccountsMain />}
      />
    ),
    <Route
      path={`${path}/reports/add-new-report`}
      key={`${path}/reports/add-new-report`}
      render={() => <AddNewReport />}
    />,
    user.role === 'SA' && (
      <Route
        path={`${path}/reports`}
        key={`${path}/reports`}
        render={() => <ReportsMain />}
      />
    ),
    user.role === 'SA' && (
      <Route path={`${path}/map`} key={`${path}/map`} render={() => <Map />} />
    ),
    <Route
      path={`${path}/charts`}
      key={`${path}/charts`}
      render={() => <ChartsMain />}
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
    <div>
      {/* {renders.current++} */}
      <Navbar className='bg-primary mb-3'>
        <Navbar.Brand style={{ color: 'white' }}>Admin Dashboard</Navbar.Brand>
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text>
            {user && (
              <p style={{ fontSize: 11, color: 'white' }}>
                Logged in as: {user.name.first} {user.name.last}
              </p>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
        <Form inline className='ml-3'>
          <Button
            onClick={() => {
              toggleModal();
            }}
            variant='danger'
            size='sm'
          >
            Logout
          </Button>
        </Form>
      </Navbar>

      <Row className='w-100'>
        <Sidebar />

        <Col>
          <Row>
            <Switch>{routes()}</Switch>
          </Row>
        </Col>
        <Col lg={1}></Col>
      </Row>

      {error && <Alert variant='danger'>{error}</Alert>}
      <LogoutModal
        toggleModal={toggleModal}
        showModal={showModal}
        handleLogout={handleLogout}
      />
    </div>
  );
}
