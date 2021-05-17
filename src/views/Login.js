import React, { useState, useRef, useEffect } from 'react';
import '../styles/login.css';
import { useAuth } from '../contexts/AuthContext';
import { Alert, Card, Form, Container, Button } from 'react-bootstrap';
import { useHistory, NavLink, useLocation } from 'react-router-dom';

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [msg, setMsg] = useState();

  async function handleSubmit(e) {
    setDisable(true);
    e.preventDefault();
    try {
      setMsg('');
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push('/dashboard');
    } catch {
      setError('Failed to Login. email or password is incorrect.');
    }
    setLoading(false);
    setDisable(false);
  }

  ///prevent the user from visiting the login page when currently logged in
  useEffect(() => {
    setMsg('');
    if (location) {
      setMsg(location.message);
    }
    if (currentUser) {
      return history.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      className='d-flex justify-items-center align-middle'
      style={{ marginTop: 150 }}
    >
      <Card style={{ width: '400px' }} className='mx-auto'>
        <Card.Body>
          <h2>Login</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          {msg && <Alert variant='danger'>{msg}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='Email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required />
            </Form.Group>

            <Form.Group id='Password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} required />
            </Form.Group>
            <Container>
              <div className='m-auto'>
                <Button
                  onClick={handleSubmit}
                  variant='primary'
                  disabled={disable}
                >
                  Login
                </Button>
              </div>
            </Container>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <NavLink to='/home'>Go back</NavLink>
      </div>
    </Container>
  );
}
export default Login;
