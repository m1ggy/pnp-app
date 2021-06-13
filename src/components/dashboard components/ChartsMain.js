import React, { useState, useRef, useEffect } from 'react';
import { Jumbotron, Row, Col, Container, Button, Form } from 'react-bootstrap';
import {
  formatData,
  formatDate,
  formatReportDataset,
} from '../../dashboard utils/utils';
import { municipalities } from '../../dashboard utils/constants';
import RenderChart from '../dashboard components/RenderChart';
import { useAuth } from '../../contexts/AuthContext';
import Select from 'react-select';
import { firestore } from '../../firebase/firebase';
import { getDataWhereQuery } from '../../utils/firebaseUtils';

export default function ChartsMain() {
  const [chartValues, setChartValues] = useState([]);
  const [reportChartValue, setReportChartValue] = useState({});
  const [reports, setReports] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(true);
  const [category] = useState([
    { label: 'Posts', value: 'posts' },
    { label: 'Galleries', value: 'galleries' },
    { label: 'Downloads', value: 'downloads' },
  ]);
  const [selectValues, setSelectValues] = useState();
  const dateRef = useRef();
  const idRef = useRef();
  const total = useRef();
  const average = useRef();
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

  const { currentUser } = useAuth();

  // eslint-disable-line react-hooks/exhaustive-deps

  async function getData(id) {
    setSelectLoading(true);
    dateRef.current = formatDate(dateRange[0].value);
    const db = firestore.collection(id);
    await db
      .where('author', '==', currentUser.email)
      .get()
      .then((q) => {
        if (q.empty) {
          return;
        }
        let temp = [];
        q.forEach((post) => {
          temp.push({ value: post.id, label: post.data().title });
        });

        setSelectValues(temp);
      });

    setLoading(false);
  }

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

  function submit(e) {
    setChartValues(null);
    e.preventDefault();
    setLoading(true);

    formatData(
      idRef.current.value,
      dateRef.current,
      idRef.current.label,
      formatDataCallback
    );
    setLoading(false);
  }

  function reportSubmit(e) {
    e.preventDefault();
    getReports(selectedCity.value);
  }

  function formatDataCallback(array, dates, title) {
    let formattedDatasets = {};
    let logs = [];
    let temp = [];

    array.forEach((log) => {
      temp.push(log.toDate().toDateString());
    });

    dates.forEach((date) => {
      logs.push(temp.reduce((pre, cur) => (cur === date ? ++pre : pre), 0));
    });

    formattedDatasets = {
      labels: dates,
      datasets: [
        {
          label: title,
          data: logs,
          fill: false,
          borderColor: 'rgba(0, 0, 0, 1)',
          backgroundColor: 'rgba(0, 0, 0, 1)',
        },
      ],
    };
    total.current = logs.reduce((a, c) => a + c);

    let num = ((logs.reduce((a, c) => a + c) / logs.length) * 100) / 100;

    average.current = num.toFixed(2);

    setChartValues(formattedDatasets);
  }
  useEffect(() => {
    console.log(reports, reportDateRef.current);
    setReportChartValue(
      formatReportDataset(reports, reportDateRef.current, selectedCity.label)
    );
  }, [reports]);

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
            {/* <Row className='w-100'>
              <Container>
                <h1>Content Chart</h1>
                <Form onSubmit={submit}>
                  <Row>
                    <Col lg={4}>
                      <Form.Group>
                        {' '}
                        <h3>Date Range</h3>
                        <Select
                          options={dateRange}
                          defaultValue={dateRange[0]}
                          onChange={(value) => {
                            dateRef.current = formatDate(value.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group>
                        <h3>Category</h3>

                        <Select
                          options={category}
                          onChange={(entry) => {
                            getData(entry.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group>
                        <h3>Entry</h3>
                        {selectValues ? (
                          <Select
                            options={selectValues}
                            onChange={(value) => {
                              idRef.current = value;
                              setSelectLoading(false);
                            }}
                          />
                        ) : (
                          <Select
                            isLoading={selectLoading}
                            loadingMessage={'Loading ....'}
                            isDisabled={selectLoading}
                          />
                        )}
                      </Form.Group>
                    </Col>

                    <div
                      className='m-auto'
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Button
                        type='submit'
                        variant='primary'
                        className='mt-3 mb-5'
                        disabled={selectLoading}
                      >
                        View
                      </Button>
                    </div>
                  </Row>
                </Form>
              </Container>
            </Row>
            <Row className='w-100'>
              {loading ? (
                <p>Please Select a Category and an Entry</p>
              ) : (
                <Col>
                  <Row>
                    <Container>
                      <Row>
                        <Col>
                          <h5 className='mt-3 mb-3'>
                            Total Interactions: {total.current}
                          </h5>
                        </Col>
                        <Col>
                          <h5 className='mt-3 mb-3'>
                            Average Interactions: {average.current}/ Day
                          </h5>
                        </Col>
                      </Row>
                    </Container>
                  </Row>
                  <Row style={{ display: 'flex', justifyContent: 'center' }}>
                    <RenderChart data={chartValues} options={options} />
                  </Row>
                </Col>
              )}
            </Row>
            */}
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
