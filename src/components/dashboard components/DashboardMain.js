import React, { useEffect, useState } from 'react';
import { Jumbotron, Col, Row, Spinner } from 'react-bootstrap';
import { firestore, firebase } from '../../firebase/firebase';

export default function DashboardMain() {
  const [data, setData] = useState(null);
  const [chartValues, setChartValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const db = firestore.collection('analytics');
  const [selectValues, setSelectValues] = useState([]);

  useEffect(() => {
    async function getData() {
      setLoading(true);

      let now = new Date();
      let sevendaysago = new Date();

      sevendaysago.setDate(sevendaysago.getDate() - 6);

      let temp = [];

      for (let d = sevendaysago; d <= now; d.setDate(d.getDate() + 1)) {
        temp.push(new Date(d));
      }
      setDates(temp);
      console.log(temp);

      let tempData = [];
      await db.get().then((q) => {
        if (q.empty) {
          return setData([]);
        }

        q.forEach((doc) => {
          tempData.push({ id: doc.id, data: doc.data() });
        });
        console.log(tempData);

        setData(tempData);

        db.doc('pageview')
          .collection('home')
          .get()
          .then((q) => {
            if (q.empty) {
              console.log('empty');
            }

            q.forEach((doc) => {
              console.log(doc.data());
            });
          });
      });

      setLoading(false);
    }
    getData();
  }, []);

  function RenderChart() {
    if (data === null || typeof data === undefined) {
      return null;
    }

    if (data.length === 0) {
      return <p>No Data</p>;
    }

    return null;
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
          {loading ? <Spinner animation='border' /> : null}
        </Jumbotron>
      </Row>
    </>
  );
}
