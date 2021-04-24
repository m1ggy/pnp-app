import { useState, useEffect } from 'react'
import { Jumbotron, Col, Row, Container, Modal, Button, Spinner, ButtonGroup, Alert} from 'react-bootstrap'
import { storage, firestore } from '../../firebase/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { set } from 'react-ga'


export default function ManageGallery() {

    const [loading, setLoading] = useState(false)
    const [gallery, setGallery] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [message, setMessage] = useState()
    const [messageShowModal, setMessageShowModal] = useState(false)
    const [selectedGallery, setSelectedGallery] = useState()
    const db = firestore.collection('galleries')
    const { currentUser } = useAuth()

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

useEffect(()=>{

    getGalleries()

}, [])

function deleteGallery(id){
    handleCloseModal()
    db.doc(id).delete().then(()=>{
            setMessage({type:'primary', msg:'Successfully deleted gallery'})
    }).catch(()=>{
        setMessage({type:'danger', msg:'Failed to delete gallery'})
    })
  
    setSelectedGallery()
    getGalleries()
    setMessageShowModal(true)
}


const handleCloseModal = () =>{
    setShowModal(false)
}



function DeleteModal(){

    if(selectedGallery === null||typeof selectedGallery === 'undefined')
    {return null;}

    return(
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header>
             <h3>
                Are you sure?
                </h3>
            </Modal.Header>
            <Modal.Body>
                Do you want to delete {selectedGallery.data.title}?
            </Modal.Body>
            <Modal.Footer>
            <ButtonGroup>
                <Button variant="primary" size="sm" className="w-75 m-3" onClick={()=>{deleteGallery(selectedGallery.id)}}>
                    Yes
                </Button>
                <Button variant="danger" size="sm" className="w-75 m-3" onClick={handleCloseModal}>
                    Cancel
                </Button>
                </ButtonGroup>
               
            </Modal.Footer>
        </Modal>
    )
}

function MessageModal(){
    if(message=== null||typeof message === 'undefined'){return null}



        return(
            <Modal show={messageShowModal} onHide={()=>{setMessageShowModal(false)}}>
            <Modal.Header>
                {message.type === 'primary'?<h3>Success!</h3>:<h3>Failed!</h3>}
            </Modal.Header>
            <Modal.Body>
             <p>{message.msg}</p>
            </Modal.Body>
            <Modal.Footer>
            <ButtonGroup>
            <Button variant="primary" size="sm" className="w-75 m-3" onClick={()=>{setMessageShowModal(false)}}>
                   Close
            </Button>
            </ButtonGroup>
            </Modal.Footer>
        </Modal>
        )

    
}


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
                            <Button variant="danger" size="sm" className="w-75 m-3" onClick={()=>{setShowModal(true);setSelectedGallery(item)}}>Delete</Button>
                        </Col>                    
                       
                    </Row>
                )
        })
    )
    
}

    return (
        <Col>
        <Row>
         <Jumbotron className="w-100"><h1>Manage Galleries</h1></Jumbotron> 
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
                        <DeleteModal/>
                        <MessageModal/>
                        </div>
                       
                    </Col>
                </Container>
            </Jumbotron>

        </Row>                    
              

            
        </Col>   
    )
}
