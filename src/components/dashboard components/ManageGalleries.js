import { useState, useEffect } from 'react'
import { Jumbotron, Col, Row, Container, Modal, Button, Spinner} from 'react-bootstrap'
import { storage, firestore } from '../../firebase/firebase'
import { useAuth } from '../../contexts/AuthContext'


export default function ManageGallery() {

    const [loading, setLoading] = useState(false)
    const [gallery, setGallery] = useState([])
    const db = firestore.collection('galleries')
    const { currentUser } = useAuth()

useEffect(()=>{
    
    async function getGalleries(){
        setLoading(true)
        let tempArray = []
        await db.where('author','==', currentUser.email).get().then((querySnapshot =>{
            if(querySnapshot.empty){
                setGallery([])
                setLoading(false)
                return;
            }

            querySnapshot.forEach((doc)=>{
              tempArray.push({id:doc.id,data:doc.data()})
            })

            setGallery(tempArray)
            setLoading(false)
        })
        )
    }

    getGalleries()

}, [])


function RenderGalleries(){

    if(gallery.length === 0){
        return(
            <div style={{display:'flex', justifyContent:'center'}}>
                <p>You have no published galleries.</p>
            </div>
        )
    }

    return(
        gallery.map((item)=>{

                return(
                    <Row key={item.id} className="w-100 border p-3"> 
                        <Col lg={10}>
                            <h3>{item.data.title}</h3>
                            <p>Date Uploaded: {item.data.dateUploaded}</p>
                        </Col>
                        <Col lg={2}> 
                            <Button variant="danger" lg>Delete</Button>
                        </Col>
                            
                           
                       
                    </Row>
                )
        })
    )
    
}

    return (
        <Col>
        <Row>
         <Jumbotron className="w-100"><h1>Manage Downloads</h1></Jumbotron> 
        </Row>
        <Row>

        </Row>  
        <Row>

            <Jumbotron className="w-100">
                <Container>
                    <Col>
                        {gallery&&<RenderGalleries/>}
                        <div style={{display:'flex', justifyContent:'center'}}>
                        {loading&&<Spinner animation="border"/>}
                        </div>
                    </Col>
                </Container>
            </Jumbotron>

        </Row>                    
              

            
        </Col>   
    )
}
