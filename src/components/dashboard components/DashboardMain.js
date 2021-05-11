import React, { useEffect, useState, useRef } from 'react';
import {
  Jumbotron,
  Col,
  Row,
  Spinner,
  Container,
  ListGroup,
} from 'react-bootstrap';
import { firestore } from '../../firebase/firebase';
import { formatDate } from '../../dashboard utils/utils';
import { useAuth } from '../../contexts/AuthContext';
import RenderChart from '../dashboard components/RenderChart';
import RenderTopOfTheWeek from '../dashboard components/RenderTopOfTheWeek';

export default function DashboardMain() {
  const [postChart, setPostChart] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const db = firestore;
  const analytics = firestore.collection('analytics');
  const [downloadChart, setDownloadChart] = useState(undefined);
  const [galleryChart, setGalleryChart] = useState(undefined);
  const dateRef = useRef();
  const [top, setTop] = useState(undefined);
  const [downloadTop, setDownloadTop] = useState(undefined);
  const [galleryTop, setGalleryTop] = useState(undefined);
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

  useEffect(() => {
    async function getData() {
      setLoading(true);

      dateRef.current = formatDate(dateRange[0].value);
      db.collection('posts')
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
          console.log(temp);
          getAllData(temp, formatDatasets, setPostChart, setTop);
        });

      db.collection('downloads')
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
          console.log(temp);
          getAllData(temp, formatDatasets, setDownloadChart, setDownloadTop);
        });

      db.collection('galleries')
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
          console.log(temp);
          getAllData(temp, formatDatasets, setGalleryChart, setGalleryTop);
        });

      setLoading(false);
    }
    getData();
  }, []);

  function getAllData(arrayOfIds, callback, setData, setTop) {
    let temp = [];
    arrayOfIds.forEach((id) => {
      analytics
        .doc(id.value)
        .get()
        .then((q) => {
          let dateString = [];
          if (q.exists) {
            q.data().pageview.forEach((date) => {
              dateString.push(date.toDate().toDateString());
            });
            temp.push({ id, data: dateString });
            callback(temp, dateRef.current, setData, setTop);
          }
        });
    });
  }

  function formatDatasets(unformattedDataset, dates, setData, setTop) {
    let tempData = [];
    let logs = [];

    unformattedDataset.forEach((dataset) => {
      dates.forEach((date) => {
        logs.push(
          dataset.data.reduce((pre, cur) => (cur === date ? ++pre : pre), 0)
        );
      });
      let color = makeRandomColor();
      tempData.push({
        label: dataset.id.label,
        data: logs,
        fill: false,
        backgroundColor: color,
        borderColor: color,
      });
      logs = [];
    });

    let formattedDatasets = {
      labels: dates,
      datasets: tempData,
    };

    let maxArray = [];
    let num = 0;
    tempData.forEach((data) => {
      data.data.forEach((count) => {
        num += count;
      });
      maxArray.push({ label: data.label, count: num });
      num = 0;

      function compare(a, b) {
        if (a.count > b.count) {
          return -1;
        }
        if (a.count < b.count) {
          return 1;
        }
        return 0;
      }

      maxArray.sort(compare);
      setTop(maxArray.slice(0, 5));
    });

    setData(formattedDatasets);
  }

  function makeRandomColor() {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s);
  }
  return (
    <>
      <Row className='w-100'>
        <Jumbotron className='w-100'>
          <h1>Dashboard</h1>
        </Jumbotron>
      </Row>
      <Row className='w-100'>
        <Jumbotron
          className='w-100'
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Col>
            <Row className='w-100'>
              <Col>
                {loading && postChart ? (
                  <Spinner animation='border' />
                ) : (
                  <RenderChart
                    data={postChart}
                    options={options}
                    header='Post Views this Week'
                  />
                )}
              </Col>
              <Col>
                {top && (
                  <div>
                    <h4 style={{ display: 'flex', justifyContent: 'center' }}>
                      Top Posts this Week
                    </h4>
                    <ListGroup>
                      {loading ? (
                        <Spinner animation='border' />
                      ) : (
                        <RenderTopOfTheWeek data={top} header='Posts' />
                      )}
                    </ListGroup>
                  </div>
                )}
              </Col>
            </Row>
            <Row className='w-100 mt-5'>
              <Col>
                {loading && downloadChart ? (
                  <Spinner animation='border' />
                ) : (
                  <RenderChart
                    data={downloadChart}
                    options={options}
                    header='Downloads this Week'
                  />
                )}
              </Col>
              <Col>
                {downloadTop && (
                  <div>
                    <h4 style={{ display: 'flex', justifyContent: 'center' }}>
                      Top Downloads this Week
                    </h4>
                    <ListGroup>
                      {loading ? (
                        <Spinner animation='border' />
                      ) : (
                        <RenderTopOfTheWeek
                          data={downloadTop}
                          header='Downloads'
                        />
                      )}
                    </ListGroup>
                  </div>
                )}
              </Col>
            </Row>
            <Row className='w-100 mt-5'>
              <Col>
                {loading && galleryChart ? (
                  <Spinner animation='border' />
                ) : (
                  <RenderChart
                    data={galleryChart}
                    options={options}
                    header='Gallery Views this Week'
                  />
                )}
              </Col>
              <Col>
                {galleryTop && (
                  <div>
                    <h4 style={{ display: 'flex', justifyContent: 'center' }}>
                      Top Galleries this Week
                    </h4>
                    <ListGroup>
                      {loading ? (
                        <Spinner animation='border' />
                      ) : (
                        <RenderTopOfTheWeek
                          data={galleryTop}
                          header='Galleries'
                        />
                      )}
                    </ListGroup>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Jumbotron>
      </Row>
    </>
  );
}
