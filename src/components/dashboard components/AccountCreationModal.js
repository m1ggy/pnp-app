import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import './accountsModal.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToastShow,
  setToastContent,
  setToastHeader,
  setToastType,
} from '../../redux/toastSlice';

export default function AccountCreationModal({ show, handler }) {
  const [name, setName] = useState({ first: '', last: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [validation, setValidation] = useState();
  const [disableButton, setDisableButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  ///redux stuff
  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toastReducer);
  function dispatchToast(content, show, header, type) {
    dispatch(setToastContent(content));
    dispatch(setToastHeader(header));
    dispatch(setToastShow(!show));
    dispatch(setToastType(type));
  }

  async function handleSubmit(e) {
    setDisableButton(true);
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    if (!validateEmail(email)) {
      setDisableButton(false);
      return setValidation(
        'Email is Invalid. Please make sure your email is valid.'
      );
    }

    if (confirmPassword !== password) {
      setDisableButton(false);
      return setValidation('Password does not match!.');
    }

    if (password.length < 8) {
      setDisableButton(false);
      return setValidation(
        'Password is short. Please make it atleast 8 characters.'
      );
    }
    setValidated(false);
    try {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          setLoading(true);
          axios
            .post('/.netlify/functions/createUser', {
              email,
              password: hash,
              name,
              verified: true,
            })
            .then((res) => {
              setLoading(false);
              dispatchToast(
                res.data.message,
                toastState.show,
                'Success',
                'success'
              );
            })
            .catch((res) => {
              setLoading(false);
              dispatchToast(
                res.data.message,
                toastState.show,
                'Failed',
                'danger'
              );
            });
        });
      });
    } catch (e) {
      console.log(e);
    }
    setValidation();
    setName({ first: '', last: '' });
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisableButton(false);
    setValidated(true);
  }

  function validateEmail(email) {
    let test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return test.test(email);
  }
  return (
    <Modal
      show={show}
      onHide={() => {
        handler();
        setMessage();
      }}
      centered
      size='md'
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className='center'>
            <Spinner animation='border' variant='primary' />
          </div>
        ) : (
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <div className='center'>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  aria-label='Email'
                  required
                  className='field'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  style={{ width: '100%' }}
                />
              </Form.Group>
            </div>

            <div
              as='Row'
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <Form.Group as='Col'>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type='text'
                  aria-label='First Name'
                  required
                  className='field'
                  value={name.first}
                  onChange={(e) => {
                    setName({ ...name, first: e.target.value });
                  }}
                  style={{ width: '100%' }}
                />
              </Form.Group>
              <Form.Group as='Col'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type='text'
                  aria-label='Last Name'
                  required
                  className='field'
                  value={name.last}
                  onChange={(e) => {
                    setName({ ...name, last: e.target.value });
                  }}
                  style={{ width: '100%' }}
                />
              </Form.Group>
            </div>
            <div
              className='center'
              as='Row'
              style={{ justifyContent: 'space-evenly' }}
            >
              <Form.Group as='Col'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  aria-label='Password'
                  required
                  className='field'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  style={{ width: '100%' }}
                  minLength={8}
                />
              </Form.Group>
              <Form.Group as='Col'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  aria-label='Confirm Password'
                  required
                  className='field'
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  style={{ width: '100%' }}
                  minLength={8}
                />
              </Form.Group>
            </div>
            <div className='center' style={{ marginBottom: 15 }}>
              {' '}
              <Button
                type='submit'
                variant='success'
                onClick={handleSubmit}
                disabled={disableButton}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className='center'>
        {message && (
          <Alert style={{ color: 'black' }} variant='info'>
            {message}
          </Alert>
        )}

        {validation && <Alert variant='danger'>{validation}</Alert>}
      </Modal.Footer>
    </Modal>
  );
}
