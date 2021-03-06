import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Jumbotron, Col, Row, Spinner, ListGroup } from 'react-bootstrap';
import { firestore } from '../../firebase/firebase';
import { formatDate } from '../../dashboard utils/utils';
import { useAuth } from '../../contexts/AuthContext';
import RenderChart from '../dashboard components/RenderChart';
import RenderTopOfTheWeek from '../dashboard components/RenderTopOfTheWeek';
import {
  getDataFromDocument,
  getDataWhereQuery,
} from '../../utils/firebaseUtils';

function makeRandomColor() {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s);
}

export default function DashboardMain() {
  const [postChart, setPostChart] = useState([]);

  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(undefined);
  const analytics = firestore.collection('analytics');
  const [downloadChart, setDownloadChart] = useState([]);
  const [galleryChart, setGalleryChart] = useState([]);
  const [generalChart, setGeneralChart] = useState([]);
  const dateRef = useRef();
  const [generalTop, setGeneralTop] = useState([]);
  const [top, setTop] = useState([]);
  const [downloadTop, setDownloadTop] = useState([]);
  const [galleryTop, setGalleryTop] = useState([]);

  const [dateRange] = useState([
    { label: '1 Week Ago', value: 6 },
    { label: '1 Month Ago', value: 30.4167 },
    { label: '6 Months Ago', value: 182.5 },
    { label: '1 Year Ago', value: 365 },
  ]);

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
  const { currentUser } = useAuth();

  useEffect(() => {
    async function getData() {
      setLoading(true);

      dateRef.current = formatDate(dateRange[0].value);

      getDataWhereQuery('posts', 'author', '==', currentUser.email, (data) => {
        let temp = [];
        data.forEach((post) => {
          temp.push({ value: post.id, label: post.title });
        });

        getAllData(temp, formatDatasets, setPostChart, setTop);
      });

      getDataWhereQuery(
        'downloads',
        'author',
        '==',
        currentUser.email,
        (data) => {
          let temp = [];
          data.forEach((post) => {
            temp.push({ value: post.id, label: post.title });
          });
          getAllData(temp, formatDatasets, setDownloadChart, setDownloadTop);
        }
      );

      getDataWhereQuery(
        'galleries',
        'author',
        '==',
        currentUser.email,
        (data) => {
          let temp = [];
          data.forEach((post) => {
            temp.push({ value: post.id, label: post.title });
          });

          getAllData(temp, formatDatasets, setGalleryChart, setGalleryTop);
        }
      );
      getDataFromDocument('analytics', 'webapp', (doc) => {
        let temp = [];
        let data = [];
        doc.pageview.forEach((date) => {
          temp.push(date.toDate().toDateString());
        });
        data.push({ id: { label: 'Web App Visits' }, data: temp });
        formatDatasets(
          data,
          formatDate(dateRange[0].value),
          setGeneralChart,
          undefined,
          setGeneralTop
        );
      });

      setLoading(false);
    }
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getAllData(arrayOfIds, callback, setData, setTop, setTotal) {
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

  function formatDatasets(
    unformattedDataset,
    dates,
    setData,
    setTop,
    setTotal
  ) {
    let tempData = [];
    let logs = [];

    unformattedDataset.forEach((dataset) => {
      dates.forEach((date) => {
        logs.push(
          dataset.data.reduce((pre, cur) => (cur === date ? ++pre : pre), 0)
        );
      });
      const color = makeRandomColor();

      tempData.push({
        label: dataset.id.label,
        data: logs,
        fill: false,
        backgroundColor: color,
        borderColor: color,
        tension: 0.3,
        pointStyle: 'rectRot',
        radius: 10,
        hoverRadius: 15,
      });
      logs = [];
    });

    let formattedDatasets = {
      labels: dates,
      datasets: tempData,
    };

    if (typeof setTop === 'undefined') {
      let percent;
      if (
        formattedDatasets.datasets[0].data[
          formattedDatasets.datasets[0].data.length - 1
        ] >
        formattedDatasets.datasets[0].data[
          formattedDatasets.datasets[0].data.length - 2
        ]
      ) {
        let increase =
          formattedDatasets.datasets[0].data[
            formattedDatasets.datasets[0].data.length - 1
          ] -
          formattedDatasets.datasets[0].data[
            formattedDatasets.datasets[0].data.length - 2
          ];

        percent =
          (increase / formattedDatasets.datasets[0].data.length - 2) * 100;

        setPercentage({ label: 'green', data: percent.toFixed(2) });
      } else if (
        formattedDatasets.datasets[0].data[
          formattedDatasets.datasets[0].data.length - 2
        ] >
        formattedDatasets.datasets[0].data[
          formattedDatasets.datasets[0].data.length - 1
        ]
      ) {
        let decrease =
          formattedDatasets.datasets[0].data[
            formattedDatasets.datasets[0].data.length - 2
          ] -
          formattedDatasets.datasets[0].data[
            formattedDatasets.datasets[0].data.length - 1
          ];
        percent =
          (decrease / formattedDatasets.datasets[0].data.length - 2) * 100;

        setPercentage({ label: 'red', data: percent.toFixed(2) });
      }
    }

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

      if (setTop) {
        maxArray.sort(compare);
        setTop(maxArray.slice(0, 5));
      } else {
        let temp = 0;
        maxArray.forEach((item) => {
          temp += item.count;
        });
        setTotal(temp);
      }
    });

    setData(formattedDatasets);
  }

  return (
    <Col>
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
              <h2>General Statistics</h2>

              <Row className='w-100'>
                {generalChart && loading ? (
                  <Spinner animation='border' />
                ) : (
                  <React.Fragment>
                    <RenderChart
                      data={generalChart}
                      options={options}
                      header='Web App Visits this Week'
                      percentage={percentage}
                    />
                  </React.Fragment>
                )}
              </Row>
            </Row>
            <Row className='w-100'>
              {generalTop && (
                <div
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className='mt-5'
                >
                  <h4>Web Visits Over the past week:{generalTop}</h4>
                </div>
              )}
            </Row>
            <Row className='w-100 mt-5'>
              <Col lg={8}>
                <h2>Charts</h2>
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
                <h2>Top this week</h2>
                {top && (
                  <div className='mt-5 '>
                    <h4 style={{ display: 'flex', justifyContent: 'center' }}>
                      Top Posts this Week
                    </h4>
                    <ListGroup
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                      }}
                    >
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
              <Col lg={8}>
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
                <div className='mt-5'>
                  <h4 style={{ display: 'flex', justifyContent: 'center' }}>
                    Top Downloads this Week
                  </h4>
                  <ListGroup
                    style={{
                      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                    }}
                  >
                    {loading && downloadTop ? (
                      <Spinner animation='border' />
                    ) : (
                      <RenderTopOfTheWeek
                        data={downloadTop}
                        header='Downloads'
                      />
                    )}
                  </ListGroup>
                </div>
              </Col>
            </Row>
            <Row className='w-100 mt-5'>
              <Col lg={8}>
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
                  <div className='mt-5'>
                    <h4 style={{ display: 'flex', justifyContent: 'center' }}>
                      Top Galleries this Week
                    </h4>
                    <ListGroup
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                      }}
                    >
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
    </Col>
  );
}
