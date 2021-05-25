import React from 'react';
import { Col, Row, Jumbotron, Form } from 'react-bootstrap';
import Select from 'react-select';
import '../../styles/addnewreport.css';
export default function AddNewReport() {
  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Add new crime report</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Sex</Form.Label>
                  <Select />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Select Status</Form.Label>
                  <Select />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Enter First Name</Form.Label>
                  <Form.Control type='text' className='input' />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Enter Middle Name</Form.Label>
                  <Form.Control type='text' className='input' />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Enter Last Name</Form.Label>
                  <Form.Control type='text' className='input' />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Select Violation</Form.Label>
                <Form.Group>
                  <Form.Control type='text' className='input' />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>Action Taken</Form.Label>
                  <Form.Control type='text' className='input' />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Jumbotron>
      </Row>
    </Col>
  );
}
