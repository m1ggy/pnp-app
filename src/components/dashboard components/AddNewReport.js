import React, { useState } from 'react';
import { Col, Row, Jumbotron, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import '../../styles/addnewreport.css';
import {
  crimeTypes,
  municipalities,
  sexes,
  statuses,
} from '../../dashboard utils/constants';
import { setDataDoc } from '../../utils/firebaseUtils';
import { useSelector, useDispatch } from 'react-redux';
import uniqid from 'uniqid';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import {
  setToastShow,
  setToastContent,
  setToastHeader,
  setToastType,
} from '../../redux/toastSlice';

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
  const [dateOccurred, setDateOccurred] = useState(new Date());
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toastReducer);

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    if (description.status === '') {
      return dispatchToast(
        'Please select a Status.',
        toastState.show,
        'Select a status.',
        'warning'
      );
    } else if (profile.sex === '') {
      return dispatchToast(
        'Please select Sex.',
        toastState.show,
        'Select sex.',
        'warning'
      );
    } else if (description.status === '' && profile.sex === '') {
      return dispatchToast(
        'Please select a Status and Sex.',
        toastState.show,
        'Select a status and sex.',
        'warning'
      );
    } else if (description.municipality === '') {
      return dispatchToast(
        'Please select a Municipality.',
        toastState.show,
        'Select a municipality.',
        'warning'
      );
    } else if (description.address === '') {
      return dispatchToast(
        'Please enter an Address.',
        toastState.show,
        'enter an address.',
        'warning'
      );
    } else if (
      profile.first.length === 0 ||
      profile.last.length === 0 ||
      profile.age.length === 0 ||
      description.violation.length === 0 ||
      description.actionTaken.length === 0 ||
      description.remarks.length === 0
    ) {
      return dispatchToast(
        'Please fill out all fields.',
        toastState.show,
        'Oops.... ',
        'warning'
      );
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
      dispatchToast(
        'added report to database. ',
        toastState.show,
        'Successfully added report.',
        'success'
      );
    });
    setDescription(descriptionInitialState);
    setProfile(profileInitialState);
    setValidated(false);
  }
  function dispatchToast(content, show, header, type) {
    dispatch(setToastContent(content));
    dispatch(setToastHeader(header));
    dispatch(setToastShow(!show));
    dispatch(setToastType(type));
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
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
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
                <Form.Group>
                  <Form.Label>Enter Violation</Form.Label>
                  <Select
                    options={crimeTypes}
                    onChange={(e) => {
                      setDescription({
                        ...description,
                        violation: e,
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
        </Jumbotron>
      </Row>
    </Col>
  );
}
