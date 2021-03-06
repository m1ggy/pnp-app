import { useParams, Link, useHistory } from 'react-router-dom';
import {
  Jumbotron,
  Col,
  Row,
  Spinner,
  Container,
  Breadcrumb,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import { pageView } from '../utils/firebaseUtils';
import React from 'react';
export default function GalleryEntry() {
  const { id } = useParams();
  const db = firestore.collection('galleries');
  const [images, setImages] = useState();
  const [loading, setLoading] = useState(false);
  const [carouselImages, setCarouselImages] = useState();
  const history = useHistory();
  useEffect(() => {
    async function getGalleries() {
      setLoading(true);
      const tempArray = [];
      const snapshot = await db.doc(id).get();

      if (snapshot.exists) {
        setImages(snapshot.data());

        snapshot.data().imagesURL.forEach((url) => {
          tempArray.push({ src: url });
        });

        setCarouselImages(tempArray);
        setLoading(false);

        return;
      }
      history.push('/404');

      return;
    }

    getGalleries();
    pageView(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <Col>
        <Row style={{ marginTop: 150, marginBottom: 50 }} className='w-100'>
          <Jumbotron className='w-100'>
            {images && (
              <React.Fragment>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link to='/gallery'>Gallery</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>{images.title}</Breadcrumb.Item>
                </Breadcrumb>
                <h1>{images.title}</h1>
                <p>{images.subtitle}</p>
                <p style={{ fontSize: 14 }}>{images.dateUploaded}</p>
              </React.Fragment>
            )}

            <Row
              className='w-100'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {loading ? <Spinner animation='border' /> : null}
              <Row
                className='w-100'
                style={{ display: 'flex', justifyContent: 'center' }}
              ></Row>
              <Row className='w-100'>
                <Container style={{ height: 650, width: '100%' }}>
                  {carouselImages && <Carousel images={carouselImages} />}
                </Container>
              </Row>
            </Row>
          </Jumbotron>
        </Row>
      </Col>
    </React.Fragment>
  );
}
