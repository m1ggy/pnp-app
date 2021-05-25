import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import './accountsModal.css';
export default function AccountCreationModal({ show, handler }) {
  const [name, setName] = useState({ first: '', last: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [validation, setValidation] = useState();
  const [jobDone, setJobDone] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();

    if (confirmPassword !== password) {
      return setValidation('Password does not match!.');
    }

    if (password.length < 8) {
      return setValidation(
        'Password is short. Please make it atleast 8 characters.'
      );
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        axios
          .post('/.netlify/functions/createUser', {
            email,
            password: hash,
            name,
            verified: true,
          })
          .then((res) => {
            setJobDone(true);
            setMessage(res.data);
          })
          .catch((res) => {
            setJobDone(true);
            console.log(res);
            setMessage(res.data);
          });
      });
    });
    setValidation();
    setName({ first: '', last: '' });
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
  }

  return (
    <Modal show={show} onHide={handler} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Create New Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {jobDone ? (
          <>{message && <Alert>{message.message}</Alert>}</>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div className='center'>
              <Form.Control
                type='text'
                aria-label='First Name'
                placeholder='First Name'
                required
                className='field'
                value={name.first}
                onChange={(e) => {
                  setName({ ...name, first: e.target.value });
                }}
              />
            </div>
            <div className='center'>
              <Form.Control
                type='text'
                aria-label='Last Name'
                placeholder='Last Name'
                required
                className='field'
                value={name.last}
                onChange={(e) => {
                  setName({ ...name, last: e.target.value });
                }}
              />
            </div>
            <div className='center'>
              <Form.Control
                type='email'
                aria-label='Email'
                placeholder='Email'
                required
                className='field'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className='center'>
              <Form.Control
                type='password'
                aria-label='Password'
                placeholder='Password'
                required
                className='field'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className='center'>
              <Form.Control
                type='password'
                aria-label='Confirm Password'
                placeholder='Confirm Password'
                required
                className='field'
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <div className='center' style={{ marginBottom: 15 }}>
              {' '}
              <Button type='submit' variant='success' onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className='center'>
        {jobDone && (
          <Button
            variant='secondary'
            onClick={() => {
              handler();
              setJobDone(false);
            }}
          >
            Close
          </Button>
        )}
        {validation && <Alert variant='danger'>{validation}</Alert>}
      </Modal.Footer>
    </Modal>
  );
}
