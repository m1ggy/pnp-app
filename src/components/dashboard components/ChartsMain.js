import { useState, useEffect, useRef } from 'react';
import {
  Jumbotron,
  Row,
  Col,
  Container,
  Button,
  Form,
  Spinner,
} from 'react-bootstrap';
import { formatData, formatDate } from '../../dashboard utils/utils';
import RenderChart from '../dashboard components/RenderChart';
import { useAuth } from '../../contexts/AuthContext';
import Select from 'react-select';
import { firestore } from '../../firebase/firebase';

export default function ChartsMain() {
  const [chartValues, setChartValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(true);
  const [category, setCategory] = useState([
    { label: 'Posts', value: 'posts' },
    { label: 'Galleries', value: 'galleries' },
    { label: 'Downloads', value: 'downloads' },
  ]);
  const [selectValues, setSelectValues] = useState();
  const dateRef = useRef();
  const idRef = useRef();
  const total = useRef();
  const average = useRef();
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
    db.where('author', '==', currentUser.email)
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
    // setChartValues(formatted);
    setLoading(false);
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
            <Row className='w-100'>
              <Container>
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
                <Spinner animation='border' />
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
          </Col>
        </Jumbotron>
      </Row>
    </Col>
  );
}
