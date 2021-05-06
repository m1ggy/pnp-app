import React, { useEffect, useState } from 'react';
import NavBarMain from '../components/NavBarMain';
import FooterMain from '../components/FooterMain';
import {
  Jumbotron,
  Row,
  Col,
  Spinner,
  Container,
  Image,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link, useRouteMatch } from 'react-router-dom';
import '../styles/gallery.css';
import GalleryEntry from './GalleryEntry';
function GalleryMain() {
  const [gallery, setGallery] = useState();
  const [loading, setLoading] = useState(false);
  const db = firestore.collection('galleries');

  const { url } = useRouteMatch();

  useEffect(() => {
    setLoading(true);

    async function getGalleries() {
      let tempArray = [];
      await db.get().then((snapshot) => {
        if (snapshot.empty) return;

        snapshot.forEach((doc) => {
          tempArray.push({ id: doc.id, data: doc.data() });
        });
        setGallery(tempArray);
        console.log(tempArray);
      });
    }

    getGalleries();
    setLoading(false);
  }, []);

  function RenderGalleries() {
    if (gallery === null || typeof gallery === 'undefined') return;

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
          <Link to={`${url}/${gallery.id}`}>
            <Image src={gallery.data.imagesURL[0]} id='imageHover' />
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
    <>
      <Col>
        <Row className='w-100'>
          <Container style={{ marginTop: 100 }}>
            <NavBarMain className='w-100 m-auto' />
          </Container>
        </Row>

        <Row>
          <Row className='w-100'>
            <Jumbotron className='mt-2 w-100'>
              <h1 className='title'>Gallery</h1>
            </Jumbotron>
          </Row>

          <Row className='w-100'>
            <Jumbotron
              className='w-100'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Row
                className='w-100'
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {loading ? <Spinner animation='border' /> : null}
                {gallery ? (
                  <RenderGalleries />
                ) : (
                  <div>
                    <p>No Galleries</p>
                  </div>
                )}
              </Row>
            </Jumbotron>
          </Row>
        </Row>

        <FooterMain />
      </Col>
    </>
  );
}

export default GalleryMain;
