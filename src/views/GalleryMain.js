import React, { useEffect, useState, useRef } from 'react';
import { Jumbotron, Row, Col, Spinner, Image } from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link, useRouteMatch } from 'react-router-dom';
import '../styles/gallery.css';
import { pageView } from '../utils/firebaseUtils';
import SpinnerPlaceholder from '../components/SpinnerPlaceholder';

function handleImageLoading(setLoading, ref, data) {
  ref.current++;

  if (ref.current >= data.length) {
    setLoading(false);
  }
}

function GalleryMain() {
  const [gallery, setGallery] = useState();
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const imgLoading = useRef(0);
  const db = firestore.collection('galleries');

  const { url } = useRouteMatch();

  useEffect(() => {
    setLoading(true);

    async function getGalleries() {
      let tempArray = [];
      await db
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
          setLoading(false);
          if (snapshot.empty) return;

          snapshot.forEach((doc) => {
            tempArray.push({ id: doc.id, data: doc.data() });
          });
          setGallery(tempArray);
        });
    }
    pageView('webapp');
    getGalleries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function RenderGalleries() {
    if (gallery === null || typeof gallery === 'undefined') return null;

    if (gallery.length === 0) {
      return (
        <div>
          <p>No Galleries.</p>
        </div>
      );
    }

    return gallery.map((gallery) => {
      return (
        <Col
          md={6}
          lg={4}
          xs={12}
          key={gallery.id}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          {showSpinner && <SpinnerPlaceholder centered={true} size='lg' />}
          <Link to={`${url}/${gallery.id}`}>
            <Image
              alt={gallery.data.title}
              effect='blur'
              src={gallery.data.imagesURL[0]}
              style={{
                boxShadow:
                  'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                padding: 0,
                margin: 0,
                visibility: showSpinner ? 'hidden' : 'visible',
              }}
              width='100%'
              id='imageHover'
              loading={'lazy'}
              onLoad={() => {
                handleImageLoading(
                  setShowSpinner,
                  imgLoading,
                  gallery.data.imagesURL
                );
              }}
            />
            <div id='galleryDesc'>
              <h3 style={{ color: 'white' }}>{gallery.data.title}</h3>
              <p style={{ color: 'white' }}>{gallery.data.subtitle}</p>
              <p style={{ color: 'white', fontSize: 13 }} muted>
                {gallery.data.dateUploaded}
              </p>
            </div>
          </Link>
        </Col>
      );
    });
  }

  return (
    <React.Fragment>
      <Col>
        <Row style={{ marginTop: 150, marginBottom: 50 }}>
          <Jumbotron className='w-100'>
            <Row
              className='w-100'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {loading ? <Spinner animation='border' /> : <RenderGalleries />}
            </Row>
          </Jumbotron>
        </Row>
      </Col>
    </React.Fragment>
  );
}

export default GalleryMain;
