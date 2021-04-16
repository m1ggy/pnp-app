import React, {useRef, useState} from 'react'
import {Jumbotron, Col, Row, Form, Alert, Container, Button} from 'react-bootstrap'
import {firestore, storage} from '../../firebase/firebase'
import {useAuth} from '../../contexts/AuthContext'
import uniqid from 'uniqid'
export default function AddNewPost() {
  
    const titleRef = useRef()
    const subtitleRef = useRef()
    const contentRef = useRef()
    const imageRef = useRef()
    const publishRef = useRef()
    const typeEventRef = useRef()
    const typeNewsRef = useRef()
    const typeOthersRef = useRef()
    const [status, setStatus] = useState()
    const {currentUser} = useAuth()

    const [showNote, setShowNote] = useState(true)

    const special = ["<",">"]
    
    const db = firestore.collection('posts')
    const storageRef = storage.ref()

    function pushData(e){

        setStatus()
        const date = new Date()
        e.preventDefault()
        ///create unique id for matching the image in storage
        const tempID = uniqid()
        const imageStorageRef = storageRef.child(`images/${tempID}.jpg`)

        if(typeEventRef.current.checked === true){
            imageStorageRef.put(imageRef)
            db.doc('events').set({
                [tempID]:{
                    title:titleRef.current.value,
                    subtitle:subtitleRef.current.value,
                    content:contentRef.current.value,
                    id:tempID,
                    published:publishRef.current.checked,
                    author:currentUser.email,
                    date: date.toDateString(),
                    time: date.toTimeString()
                }
            },{merge:true}).then(()=>{
                setStatus(true)
            }).catch(()=>{
                setStatus(false)
            })
            
        }
        else if(typeNewsRef.current.checked === true){
            db.doc('news').set({
                [tempID]:{
                    title:titleRef.current.value,
                    subtitle:subtitleRef.current.value,
                    content:contentRef.current.value,
                    id:tempID,
                    published:publishRef.current.checked,
                    author:currentUser.email,
                    date: date.toDateString(),
                    time: date.toTimeString()
                    
                }
            },{merge:true}).then(()=>{
                setStatus(true)
            }).catch(()=>{
                setStatus(false)
            })
        }
        else if(typeOthersRef.current.checked === true){
            db.doc('others').set({
                [tempID]:{
                    title:titleRef.current.value,
                    subtitle:subtitleRef.current.value,
                    content:contentRef.current.value,
                    id:tempID,
                    published:publishRef.current.checked,
                    author:currentUser.email,
                    date: date.toDateString(),
                    time: date.toTimeString()
                }
            },{merge:true}).then(()=>{
                setStatus(true)
            }).catch(()=>{
                setStatus(false)
            })
        }
        e.target.reset()
    }
    return (
        <>
         <Col>
                <Row>
                    <Jumbotron className="w-100"><h1>Add New Post</h1></Jumbotron> 
                </Row>
         
               <Row>
               <Col >
               <Jumbotron className="w-100">
               <Container>
               {status
               ?<Alert variant="success"><Alert.Heading>Post Added!</Alert.Heading>Successfully added post.</Alert>
               :status === false?<Alert variant="danger"><Alert.Heading>Post was not added!</Alert.Heading>the post was not added to the database. Please try again.</Alert>
               :status === 'undefined'?null
               :null
               }
               <Form onSubmit={pushData}>

                <Form.Group>
                    <Form.Label>
                    <b>Enter Title</b>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Title" required style={{width:"50%"}} ref={titleRef}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                    <b>Enter Subtitle</b>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Subtitle" required style={{width:"75%"}} ref={subtitleRef}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        <b>Enter Content </b>
                    </Form.Label>
                    
                    <Form.Control as="textarea" required rows={25}style={{resize:'none', width:"100%"}} ref={contentRef}/>
                </Form.Group>

                <Form.Group>
                    <Form.File label="Enter Banner Image" required accept="image/*" style={{width:300}} ref={imageRef}/>
                </Form.Group>

                <Form.Group className="mt-4">
                <Form.Label><b>Select Post Type:</b></Form.Label>
                        <Form.Check
                            type="radio"
                            label="Events"
                            name="type"
                            id="events"
                            ref={typeEventRef}
                        />
                        <Form.Check
                            type="radio"
                            label="News"
                            name="type"
                            id="news"
                            ref={typeNewsRef}
                        />
                        <Form.Check
                            type="radio"
                            label="Others"
                            name="type"
                            id="others"
                            ref={typeOthersRef}
                        />
                </Form.Group>

                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    label="Publish"
                    ref={publishRef}               
                />
                <Button variant="primary" type="submit" className="mt-5" size="lg">
                    Submit
                </Button>

                </Form>
            </Container>
               </Jumbotron>
               </Col>

               <Col xs lg="3">
                <Jumbotron>
                <h3>Tips</h3>
                    {showNote
                    ?<Alert variant="info" onClose={()=>{setShowNote(false)}} dismissible><Alert.Heading>#1</Alert.Heading><p>You can use HTML Tags to format your content (ex. <code>{special[0]}b{special[1]}</code> for <b>bold</b>)</p></Alert>
                    :<Button onClick={()=>{setShowNote(true)}}>Show Tips</Button>
                    }  
                </Jumbotron>
               </Col> 

               </Row>                                         
           </Col>
          

        </>
    )
}
