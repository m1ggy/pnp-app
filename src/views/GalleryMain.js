import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import { Jumbotron, Row, Col, Spinner, Container, Image} from 'react-bootstrap'
import { firestore } from '../firebase/firebase'
import '../styles/gallery.css'
function GalleryMain (){
    const [gallery, setGallery] = useState()
    const [loading, setLoading] = useState(false)
    const db = firestore.collection('galleries')
    const [groupedImages, setGroupedImages] = useState()
    const [show, setShow] = useState(false)

    useEffect(()=>{

        setLoading(true)

        async function getGalleries(){
            let tempArray = []
            await db.get().then((snapshot)=>{
                    if(snapshot.empty) return;

                    snapshot.forEach(doc=>{
                        tempArray.push({id:doc.id,data:doc.data()})
                        
                    })
                    setGallery(tempArray)
                    console.log(tempArray)
            })
        }
    
        getGalleries()
        setLoading(false)
    },[])

    function RenderGalleries(){
        if(gallery === null||typeof gallery === 'undefined') return;

        return gallery.map((gallery)=>{

            return(
                <Col md={4} lg={4} xs={12} key={gallery.id} className="border" style={{display:'flex', justifyContent:'center'}}>
                    <Image src={gallery.data.imagesURL[0]} id="imageHover"/>
                    <div id="galleryDesc">
                        <p>{gallery.data.title}</p>
                        <p>{gallery.data.subtitle}</p>
                    </div>
                   
                </Col>
            )

        })
    }

    return(
        <>
        <Col>

            <Row>
                <Header  className="mt-2 w-100"/>
            </Row>

            <Row className="w-100">
            <Container>
                <NavBarMain className="mt-2 w-100 m-auto"/>
                </Container>
            </Row>

            <Row>

                <Row className="w-100">
                    <Jumbotron className="mt-2 w-100">
                        <h1 className="title">Gallery</h1>  
                    </Jumbotron>
                </Row>

                <Row className="w-100">
                    <Jumbotron className="mt-2 w-100" style={{display:'flex', justifyContent:'center'}}>
                    <Row className="w-100 border">
                    {loading?<Spinner animation="border"/>:null}  
                        {gallery?<RenderGalleries/>:null}
                    </Row>
                    </Jumbotron>                    
                </Row>

            </Row>
          
                <FooterMain/>                             
        </Col>
    </>
    )
}


export default GalleryMain