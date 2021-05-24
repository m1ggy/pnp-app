import React, { useState, useRef, useEffect } from 'react';
import '../styles/login.css';
import { useAuth } from '../contexts/AuthContext';
import { Alert, Card, Form, Container, Button, Spinner } from 'react-bootstrap';
import { useHistory, NavLink } from 'react-router-dom';
import { IoReturnDownBackSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/usersSlice';
import { firestore } from '../firebase/firebase';
function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState();
  const [disable, setDisable] = useState(false);
  const history = useHistory();
  const [msg, setMsg] = useState();
  const dispatch = useDispatch();
  const users = firestore.collection('users');
  async function handleSubmit(e) {
    setDisable(true);
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      await login(emailRef.current.value, passwordRef.current.value).then(
        (user) => {
          users
            .doc(user.user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                dispatch(setUser(doc.data()));
              }
            });
        }
      );
      history.push('/dashboard');
    } catch {
      setDisable(false);
      setError('Failed to Login. email or password is incorrect.');
    }
  }

  useEffect(() => {
    setError('');
    setMsg('');
    if (currentUser) {
      return history.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='centered-div'>
      <Card
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          width: 500,
        }}
        className='login-card'
      >
        <Card.Body>
          <h2>Login</h2>
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
              <div
                className='m-auto'
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button
                  onClick={handleSubmit}
                  variant='primary'
                  disabled={disable}
                >
                  {disable ? <Spinner animation='border' /> : 'Login'}
                </Button>
              </div>
            </Container>
          </Form>
        </Card.Body>
        <Card.Footer>
          {error && <Alert variant='danger'>{error}</Alert>}
          {msg && (
            <Alert variant='success' className='text-center'>
              {msg}
            </Alert>
          )}
          <div className='w-100 text-center mt-2'>
            <NavLink to='/home'>
              <IoReturnDownBackSharp style={{ width: 25, height: '100%' }} /> Go
              back
            </NavLink>
          </div>
        </Card.Footer>
      </Card>
      <div className='text-center mt-2'>
        <a href='$'>Report a Bug.</a>
      </div>
    </div>
  );
}
export default Login;
