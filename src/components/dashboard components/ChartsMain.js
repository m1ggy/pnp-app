import React, { useState, useRef, useEffect } from 'react';
import { Jumbotron, Row, Col, Container, Button, Form } from 'react-bootstrap';
import { formatDate, formatReportDataset } from '../../dashboard utils/utils';
import { municipalities } from '../../dashboard utils/constants';
import RenderChart from '../dashboard components/RenderChart';
import Select from 'react-select';
import { getDataWhereQuery } from '../../utils/firebaseUtils';

export default function ChartsMain() {
  const [reportChartValue, setReportChartValue] = useState({});
  const [reports, setReports] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(true);

  const reportDateRef = useRef();
  const [dateRange] = useState([
    { label: '1 Week Ago', value: 6 },
    { label: '1 Month Ago', value: 30.4167 },
    { label: '6 Months Ago', value: 182.5 },
    { label: '1 Year Ago', value: 365 },
  ]);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  async function getReports(id) {
    getDataWhereQuery(
      'reports',
      'description.municipality.value',
      '==',
      id,
      (res) => {
        setReports(res);
      }
    );
  }

  function reportSubmit(e) {
    e.preventDefault();
    getReports(selectedCity.value);
  }

  useEffect(() => {
    setReportChartValue(
      formatReportDataset(reports, reportDateRef.current, selectedCity.label)
    );
  }, [reports]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Col>
      <Row className='w-100'>
        <Jumbotron className='w-100'>
          <h1>Charts</h1>
        </Jumbotron>
      </Row>
      <Row className='w-100'>
        <Jumbotron
          className='w-100'
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Col>
            <Row className='w-100 mt-5'>
              <Container>
                <h1> Crime Report Chart</h1>
                <Form onSubmit={reportSubmit}>
                  <Row>
                    <Col>
                      <Form.Group>
                        {' '}
                        <h3>Date Range</h3>
                        <Select
                          options={dateRange}
                          onChange={(value) => {
                            reportDateRef.current = formatDate(value.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <h3>Municipality / City</h3>

                        <Select
                          options={municipalities}
                          onChange={(entry) => {
                            setSelectedCity(entry);
                            if (reportDateRef.current) setDisableSubmit(false);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <div
                      className='m-auto'
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Button
                        type='submit'
                        variant='primary'
                        className='mt-3 mb-5'
                        disabled={disableSubmit}
                      >
                        View
                      </Button>
                    </div>
                  </Row>

                  <Row>
                    {reportChartValue && (
                      <RenderChart data={reportChartValue} options={options} />
                    )}
                  </Row>
                </Form>
              </Container>
            </Row>
          </Col>
        </Jumbotron>
      </Row>
    </Col>
  );
}
