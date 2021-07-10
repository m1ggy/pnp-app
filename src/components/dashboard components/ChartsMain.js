import React, { useState, useEffect, useMemo } from 'react';
import { Jumbotron, Row, Col, Container, Form, Button } from 'react-bootstrap';
import { formatDate, formatReportDataset } from '../../dashboard utils/utils';
import { municipalities, crimeTypes } from '../../dashboard utils/constants';
import RenderChart from '../dashboard components/RenderChart';
import Select from 'react-select';
import {
  getDataFromCollection,
  getDataWhereQuery,
} from '../../utils/firebaseUtils';
import SpinnerPlaceholder from '../SpinnerPlaceholder';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToastShow,
  setToastContent,
  setToastHeader,
  setToastType,
} from '../../redux/toastSlice';

export default function ChartsMain() {
  const dateDefaults = useMemo(() => dateFactory(), []);
  const [reportChartValue, setReportChartValue] = useState();
  const [reports, setReports] = useState([]);
  const [selectedCity, setSelectedCity] = useState({
    label: 'Laguna',
    value: 'laguna',
  });
  const [crime, setCrime] = useState({ label: 'All', value: 'all' });
  const [date, setDate] = useState(null);
  const [dateRange, setDateRange] = useState(dateDefaults);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toastReducer);
  const options = useMemo(() => {
    optionsFactory();
  }, []);

  function optionsFactory() {
    return {
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
  }
  function dispatchToast(content, show, header, type) {
    dispatch(setToastContent(content));
    dispatch(setToastHeader(header));
    dispatch(setToastShow(!show));
    dispatch(setToastType(type));
  }

  function dateFactory() {
    return [
      { label: '1 Week Ago', value: 6 },
      { label: '1 Month Ago', value: 30.4167 },
      { label: '6 Months Ago', value: 182.5 },
      { label: '1 Year Ago', value: 365 },
    ];
  }

  function getReports(id) {
    if (id === 'laguna') {
      getDataFromCollection('reports', (res) => {
        setReports(res);
      });
    } else {
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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (date == null)
      return dispatchToast(
        'Please select a date.',
        toastState.show,
        'Select a Date.',
        'warning'
      );
    if (selectedCity == null)
      return dispatchToast(
        'Please select a Municipality/City.',
        toastState.show,
        'Select a municipality to display chart.',
        'warning'
      );
    if (crime == null)
      return dispatchToast(
        'Please select a crime type.',
        toastState.show,
        'Select a crime type to display in the chart..',
        'warning'
      );
    setLoading(true);
    let newReports = [...reports];

    if (crime.value === 'all') {
      const data = await formatReportDataset(
        reports,
        formatDate(date.value),
        crime,
        date
      );
      setLoading(false);

      setReportChartValue(data);
      return;
    }

    let filtered = newReports.filter(
      (report) => report.description.violation.value === crime.value
    );

    const data = await formatReportDataset(
      filtered,
      formatDate(date.value),
      crime,
      date
    );
    setLoading(false);
    setReportChartValue(data);
    return;
  }

  useEffect(() => {
    if (selectedCity) {
      getReports(selectedCity.value);
    }
  }, [selectedCity]);

  useEffect(() => {
    crimeTypes.push({ label: 'All', value: 'all' });
    municipalities.push({ label: 'Laguna', value: 'laguna' });
  }, []);

  useEffect(() => {
    if (reports == null) return null;

    let arrayOfDates = [];

    reports.forEach((report) => arrayOfDates.push(report.dateOccurred));

    if (
      arrayOfDates.length > 0 &&
      JSON.stringify(dateRange) === JSON.stringify(dateDefaults)
    ) {
      let mostRecentDate = arrayOfDates.reduce((a, b) => (b > a ? a : b));

      var now = new Date();
      var start = mostRecentDate.toDate();
      var diff =
        now -
        start +
        (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
      var oneDay = 1000 * 60 * 60 * 24;
      var day = Math.floor(diff / oneDay);

      setDateRange([
        ...dateRange,
        { label: 'All Time ', value: day + 1 },
        { label: 'All Time (Hourly)', value: day + 1 },
      ]);
      return;
    }
    return () => null;
  }, [reports, dateDefaults, dateRange]);

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
          style={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <Col>
            <Row className='w-100 mt-5'>
              <Container>
                <h1> Crime Report Chart</h1>

                <Col as='form' onSubmit={handleSubmit} className='w-100'>
                  <Row>
                    <Col>
                      <Form.Group>
                        <h3>Municipality / City</h3>

                        <Select
                          options={municipalities}
                          value={selectedCity}
                          onChange={(entry) => {
                            setSelectedCity(entry);
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        {' '}
                        <h3>Date Range</h3>
                        <Select
                          options={dateRange}
                          isOptionSelected={(option, selectValue) =>
                            selectValue.some((i) => i === option)
                          }
                          onChange={(value) => {
                            setDate(value);
                          }}
                          value={date}
                        />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <h3>Crime Type</h3>
                        <Select
                          options={crimeTypes}
                          value={crime}
                          onChange={(e) => {
                            setCrime(e);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row
                    className='w-100'
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Button type='submit' disabled={loading}>
                      {loading ? <SpinnerPlaceholder /> : 'Submit'}
                    </Button>
                  </Row>
                </Col>
                <Row className='w-100'>
                  {loading ? (
                    <Col>
                      <SpinnerPlaceholder centered size='lg' />
                    </Col>
                  ) : (
                    reportChartValue && (
                      <RenderChart data={reportChartValue} options={options} />
                    )
                  )}
                </Row>
              </Container>
            </Row>
          </Col>
        </Jumbotron>
      </Row>
    </Col>
  );
}
