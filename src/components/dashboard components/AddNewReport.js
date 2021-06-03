import React, { useState } from 'react';
import { Col, Row, Jumbotron, Form, Button, Alert } from 'react-bootstrap';
import Select from 'react-select';
import '../../styles/addnewreport.css';
import {
  municipalities,
  sexes,
  statuses,
} from '../../dashboard utils/constants';
import { setDataDoc } from '../../utils/firebaseUtils';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
export default function AddNewReport() {
  const descriptionInitialState = {
    status: '',
    violation: '',
    actionTaken: '',
    remarks: '',
    address: '',
    municipality: '',
  };
  const profileInitialState = {
    first: '',
    last: '',
    sex: '',
    age: '',
  };

  const [profile, setProfile] = useState(profileInitialState);
  const author = useSelector((state) => state.userReducer.user);
  const [description, setDescription] = useState(descriptionInitialState);
  const [message, setMessage] = useState();
  const [dateOccurred, setDateOccurred] = useState(new Date());

  function handleSubmit(e) {
    e.preventDefault();

    setMessage();

    if (description.status === '') {
      return setMessage('Please select a status');
    } else if (profile.sex === '') {
      return setMessage('Please select a sex');
    } else if (description.status === '' && profile.sex === '') {
      return setMessage('Please select a status and sex');
    } else if (description.municipality === '') {
      return setMessage('Please select a municipality');
    }

    const id = uniqid();

    const data = {
      description,
      profile,
      author: author.email,
      timestamp: new Date(),
      id,
      dateOccurred,
    };

    setDataDoc(id, data, 'reports', (res) => {
      setMessage(res.message);
    });
    setDescription(descriptionInitialState);
    setProfile(profileInitialState);
  }

  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Add new crime report</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Sex</Form.Label>
                  <Select
                    options={sexes}
                    onChange={(sex) => {
                      setProfile({ ...profile, sex });
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Select Status</Form.Label>
                  <Select
                    options={statuses}
                    onChange={(status) => {
                      setDescription({ ...description, status });
                    }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Enter First Name</Form.Label>
                  <Form.Control
                    type='text'
                    className='input'
                    value={profile.first}
                    onChange={(e) => {
                      setProfile({ ...profile, first: e.target.value });
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Enter Last Name</Form.Label>
                  <Form.Control
                    type='text'
                    className='input'
                    value={profile.last}
                    onChange={(e) => {
                      setProfile({ ...profile, last: e.target.value });
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Enter Age</Form.Label>
                  <Form.Control
                    type='number'
                    className='input'
                    value={profile.age}
                    onChange={(e) => {
                      setProfile({ ...profile, age: e.target.value });
                    }}
                    min='18'
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Enter Violation</Form.Label>
                <Form.Group>
                  <Form.Control
                    type='text'
                    className='input'
                    value={description.violation}
                    onChange={(e) => {
                      setDescription({
                        ...description,
                        violation: e.target.value,
                      });
                    }}
                    required
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>Action Taken</Form.Label>
                  <Form.Control
                    type='text'
                    className='input'
                    value={description.actionTaken}
                    onChange={(e) => {
                      setDescription({
                        ...description,
                        actionTaken: e.target.value,
                      });
                    }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    type='text'
                    className='input'
                    value={description.remarks}
                    onChange={(e) => {
                      setDescription({
                        ...description,
                        remarks: e.target.value,
                      });
                    }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Municipality / City</Form.Label>
                  <Select
                    options={municipalities}
                    onChange={(selection) =>
                      setDescription({
                        ...description,
                        municipality: selection,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type='text'
                    className='input'
                    value={description.address}
                    onChange={(e) => {
                      setDescription({
                        ...description,
                        address: e.target.value,
                      });
                    }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <Form.Group>
                  <Form.Label>Select the date the crime occurred</Form.Label>
                  <br></br>
                  <DateTimePicker
                    value={dateOccurred}
                    onChange={setDateOccurred}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type='submit'
                onClick={() => {
                  console.log(description, profile, dateOccurred);
                }}
              >
                Submit
              </Button>
            </Row>
          </Form>
          <Row>
            <Col>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
              >
                {message && (
                  <Alert
                    variant='info'
                    style={{ width: '50%', textAlign: 'center' }}
                  >
                    {message}
                  </Alert>
                )}
              </div>
            </Col>
          </Row>
        </Jumbotron>
      </Row>
    </Col>
  );
}
