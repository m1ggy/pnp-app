import React, { useEffect, useState } from 'react';
import {
  Jumbotron,
  Row,
  Col,
  Container,
  Spinner,
  Button,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { pageView } from '../utils/firebaseUtils';

function Downloads() {
  const [downloads, setDownloads] = useState();
  const [loading, setLoading] = useState();

  const db = firestore.collection('downloads');

  function RenderDownloads() {
    let types = [
      { type: 'advisories', label: 'Advisory' },
      { type: 'bidsAndArchives', label: 'Bids and Archives' },
      { type: 'generalDownloads', label: 'General Downloads' },
      { type: 'transparencySeal', label: 'Transparency Seal' },
    ];

    if (downloads == null) return;

    return types.map((type, index) => {
      let filtered = downloads.filter((item) => {
        return item.id === type.type;
      });
      return (
        <Container key={type.type + index} className='border p-5'>
          <h3>{type.label}</h3>
          <RenderEachDownload data={filtered} label={type.label} />
        </Container>
      );
    });
  }

  async function sendData(item) {
    pageView(item.data.id);
  }

  function RenderEachDownload({ data, label }) {
    if (data == null || typeof data == undefined) {
      return <p>No Items inside</p>;
    } else if (data.length < 1) {
      return <p>{label} is empty.</p>;
    }
    return data.map((item, index) => {
      return (
        <Container key={item.id + index} className='p-3 border'>
          <Row>
            <Col lg={10}>
              <p style={{ fontWeight: 'bold', fontSize: 16 }}>
                {item.data.title}
              </p>
              <p style={{ fontSize: 13 }}>{item.data.size} MB</p>
            </Col>
            <Col lg={2}>
              <Button
                variant='primary'
                href={item.data.url}
                onClick={() => {
                  sendData(item);
                }}
              >
                Download
              </Button>
            </Col>
          </Row>
        </Container>
      );
    });
  }

  useEffect(() => {
    setLoading(true);

    pageView('webapp');

    async function getData() {
      let tempArray = [];

      await db.get().then((snapshot) => {
        if (snapshot.empty) return;

        snapshot.forEach((doc) => {
          tempArray.push({ id: doc.data().type.value, data: doc.data() });
        });

        setDownloads(tempArray);
      });
    }
    getData();

    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Col>
        <Row style={{ marginTop: 150, marginBottom: 50 }}>
          <Jumbotron className='w-100'>
            <h1 className='title'>Downloads</h1>
            <Container>
              {loading && <Spinner animation='border' />}
              {downloads ? (
                <RenderDownloads />
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <p>No Downloads</p>
                </div>
              )}
            </Container>
          </Jumbotron>
        </Row>
      </Col>
    </>
  );
}
export default Downloads;
