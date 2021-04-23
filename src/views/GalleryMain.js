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
                <Col md={6} lg={4} xs={12} key={gallery.id} style={{display:'flex', justifyContent:'center', marginTop:'20px'}}>
                    <Image src={gallery.data.imagesURL[0]} id="imageHover"/>
                    <div id="galleryDesc">
                        <h3  style={{color:'white'}}>{gallery.data.title}</h3>
                        <p  style={{color:'white'}}>{gallery.data.subtitle}</p>
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
                    <Row className="w-100">
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