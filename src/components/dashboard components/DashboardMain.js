import React, { useEffect, useState } from 'react';
import { Jumbotron, Col, Row, Spinner } from 'react-bootstrap';
import { ReactGA } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardMain() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { checkSignedIn, renderButton, analyticsUser } = useAuth();
  const [data, setData] = useState(null);

  const updateSignin = (signedIn) => {
    //(3)
    setIsSignedIn(signedIn);
    if (!signedIn) {
      renderButton();
    }
  };

  const init = () => {
    //(2)
    checkSignedIn()
      .then((signedIn) => {
        updateSignin(signedIn);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    window.gapi.load('auth2', init); //(1)
  });

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  useEffect(() => {
    const queryReport = () => {
      //(1)
      window.gapi.client
        .request({
          path: '/v4/reports:batchGet',
          root: 'https://analyticsreporting.googleapis.com/',
          method: 'POST',
          body: {
            reportRequests: [
              {
                viewId: '242320855',
                dateRanges: [
                  {
                    startDate: '30daysAgo',
                    endDate: 'today',
                  },
                ],
                metrics: [
                  {
                    expression: 'ga:pageviews',
                  },
                ],
              },
            ],
          },
        })
        .then(displayResults, console.error.bind(console));
    };

    const displayResults = (response) => {
      //(2)
      console.log(response);
      //  let e = await response.result.reports[0].data.rows[0].metrics[0].values[0]
      //  console.log(e)
      //  setData(results);
    };

    queryReport();
  }, []);

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
          {!isSignedIn ? <div id='signin-button'></div> : <div>Signed In</div>}

          {data && <div>{data}</div>}
        </Jumbotron>
      </Row>
    </>
  );
}
