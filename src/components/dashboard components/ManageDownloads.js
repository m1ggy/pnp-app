import React, {useEffect, useState, useRef} from 'react'
import { Jumbotron, Col, Row, Container, Spinner, Form, Button, Modal, Alert } from 'react-bootstrap'
import { storage, firestore } from '../../firebase/firebase'
import { useAuth } from '../../contexts/AuthContext'
import uniqid from 'uniqid'

export default function ManageDownloads() {

    const storageRef = storage.ref()
    const db = firestore.collection('downloads')
    const {currentUser} = useAuth()
    const [message, setMessage] = useState({})
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [downloads, setDownloads] = useState()
    const [downloadType, setDownloadType] = useState()
    const typeRef = useRef()
    const pathRef = useRef()
    const fileRef = useRef()

    function handleShowModal (){
        setShowModal(true)
    }
    function handleCloseModal (){
        setShowModal(false)
    }
    
    function handleFile (){
       return fileRef.current.files[0]
    }
    
    async function uploadFiles(path, id, file){
        setMessage()
        const uploadTask = storageRef.child(`downloads/${path}/${id}-${file.name}`)

         await uploadTask.put(file)
        .then(()=>{

           uploadTask.getDownloadURL()
           .then((url)=>{

               return pushData(url, id, file)

           })
           .catch(e=>{

               console.log(e)

            })
        })
    }

    async function pushData(url, id, file){

        const date = new Date()
       
       await db.doc(typeRef.current).set({
            [id]:{
                author: currentUser.email,
                id:id,
                url:url,
                type:typeRef.current,
                date:date.toDateString(),
                time:date.toTimeString(),
                name:file.name
            }
        }, {merge:true})
        .then(()=>{
            setMessage({type:'success', msg:'File Uploaded successfully'})
        }).catch(()=>{
            setMessage({type:'danger', msg:'An Error Occurred. File was not uploaded.'})
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        const id = uniqid()
       
        uploadFiles(typeRef.current, id, handleFile())
        e.target.reset()
    }
 

    useEffect(()=>{

        async function getDownloads(){
            await db.get().then(
                (querySnapshot=>{
                    if(querySnapshot.empty){
                        setDownloads()
                        return;
                    }
                    let tempArray = []
                    let idArray = []
                    querySnapshot.forEach(doc=>{
                        idArray.push(doc.id)
                        tempArray.push(doc.data())
                    })
                    setDownloads(tempArray)
                    setDownloadType(idArray)
                })
            )
        }

        setLoading(true)     
        getDownloads()
        setLoading(false)

    }, [])

    function FormModal(){
        return(
            <Modal
            show={showModal}
            onHide={handleCloseModal}
            backdrop="static"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    Add New File
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
            <div className="w-100">
                <Form onSubmit={handleSubmit}>
                       <Form.Group>
                           <Form.Label>
                               Select File
                           </Form.Label>
                           <Form.File required onChange={handleFile} multiple={false} ref={fileRef}/>
                       </Form.Group>
   
                       <Form.Group>
                       <Form.Label>
                           Select file group
                       </Form.Label>
                       <Form.Control
                           as="select"
                           className="mr-sm-2"                 
                           onChange={(e)=>{typeRef.current = e.target.value}}
                           required
                       >
                           <option value="transparencySeal">Transparency Seal</option>
                           <option value="bidsAndArchives">Bids and Archives</option>
                           <option value="advisories">Advisories</option>
                           <option value="generalDownloads">General Downloads</option>
                       </Form.Control>
   
                       </Form.Group>
                       <Container>
                       <Button variant="primary" type="submit" className="mt-5 w-25 m-auto" size="md">Submit</Button>

                       {message&&<Alert variant={message.type}><p>{message.msg}</p></Alert>}
                       </Container>
                       
                      
                </Form>
                </div>
                </Container>
            </Modal.Body>
   
            </Modal>
        )
    }
    function RenderDownloads (){
    if(downloadType){
        if(downloads){
            
            return(
                downloadType.map((type)=>{
                        
                   return downloads.map((item, index)=>{
                        let renderItem =  Object.keys(item)
                      
                       return renderItem.map((render,index)=>{

                        if(item[`${renderItem[0]}`].type === type){
                           
                            return(
                                <Container key={render+index}>
                                    <p>{item[`${renderItem[0]}`].name}</p>
                                    <p>{item[`${renderItem[0]}`].type}</p>
                                </Container>

                            )
                        }
                       })

                    })
                    
                })
            )
        
        }
    }
    return(
        <p>
            No Downloads
        </p>
    )
}


    return (
        <>
         <FormModal/> 
        <Col>
        <Row>
         <Jumbotron className="w-100"><h1>Manage Downloads</h1></Jumbotron> 
        </Row>
        <Row>

            <Jumbotron className="w-100">
             <div className="m-auto">
                <Button variant="primary" onClick={handleShowModal}>
                 Add New File
                </Button>
            </div>

            <FormModal/>

            </Jumbotron>

        </Row>  
        <Row>

            <Jumbotron className="w-100">
                <Container>
                <div className="m-auto">

                
                    {loading?<Spinner animation="border"/>:null}
                    {downloads?<RenderDownloads/>:<p>No Downloads</p>}
                    </div>
                </Container>
            </Jumbotron>

        </Row>                    
              

            
        </Col>   
       
        </>
    )
}
