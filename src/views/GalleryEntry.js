import { useParams, Link } from 'react-router-dom';
import {
  Jumbotron,
  Col,
  Row,
  Breadcrumb,
  Spinner,
  Container,
} from 'react-bootstrap';
import NavBarMain from '../components/NavBarMain';
import FooterMain from '../components/FooterMain';
import { firestore, firebase } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
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
        console.log(tempArray);
        setCarouselImages(tempArray);
        setLoading(false);

        return;
      }

      return;
    }
    function sendData() {
      const date = new Date();
      analytics
        .doc(id)
        .set({
          pageview: firebase.firestore.FieldValue.arrayUnion(date),
        })
        .then(() => {
          console.log('added gallery view');
        });
    }

    getGalleries();
    sendData();
  }, []);

  return (
    <>
      <Col>
        <Row style={{ marginTop: 100 }}>
          <Row className='w-100'>
            <Jumbotron className='mt-2 w-100'>
              <Link to='/gallery'>
                <p style={{ fontSize: 15 }}>Go Back</p>
              </Link>
              <h1 className='title'>Gallery</h1>
            </Jumbotron>
          </Row>

          <Row className='w-100'>
            <Jumbotron
              className='mt-2 w-100'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Row
                className='w-100'
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {loading ? <Spinner animation='border' /> : null}
                <Row
                  className='w-100'
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {images && (
                    <div>
                      <h3>{images.title}</h3>
                      <p>{images.subtitle}</p>
                      <p style={{ fontSize: 14 }}>{images.dateUploaded}</p>
                    </div>
                  )}
                </Row>
                <Row className='w-100'>
                  <Container style={{ height: 650, width: '100%' }}>
                    {carouselImages && <Carousel images={carouselImages} />}
                  </Container>
                </Row>
              </Row>
            </Jumbotron>
          </Row>
        </Row>

        <FooterMain />
      </Col>
    </>
  );
}
