import { useParams, Link } from 'react-router-dom';
import {
  Jumbotron,
  Col,
  Row,
  Spinner,
  Container,
  Breadcrumb,
} from 'react-bootstrap';
import { firestore, firebase } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import { pageView } from '../utils/firebaseUtils';
export default function GalleryEntry() {
  const { id } = useParams();
  const db = firestore.collection('galleries');
  const analytics = firestore.collection('analytics');
  const [images, setImages] = useState();
  const [loading, setLoading] = useState(false);
  const [carouselImages, setCarouselImages] = useState();

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

      return;
    }

    getGalleries();
    pageView(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Col>
        <Row style={{ marginTop: 150, marginBottom: 50 }}>
          <Jumbotron className='w-100'>
            {images && (
              <>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link to='/gallery'>Gallery</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>{images.title}</Breadcrumb.Item>
                </Breadcrumb>
                <h1>{images.title}</h1>
                <p>{images.subtitle}</p>
                <p style={{ fontSize: 14 }}>{images.dateUploaded}</p>
              </>
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
    </>
  );
}
