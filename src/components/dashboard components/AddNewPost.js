import React, {useRef, useState} from 'react'
import {Jumbotron, Col, Row, InputGroup, Form, Alert, Container, Button} from 'react-bootstrap'
import {firestore} from '../../firebase/firebase'


export default function AddNewPost() {
  
    const titleRef = useRef()
    const subtitleRef = useRef()
    const contentRef = useRef()
    const imageRef = useRef()
    const publishRef = useRef()
    const typeEventRef = useRef()
    const typeNewsRef = useRef()
    const typeOthersRef = useRef()

    const [showNote, setShowNote] = useState(true)

    const special = ["<",">"]
    
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
               <Form onSubmit={()=>{<Alert>Submitted</Alert>}}>

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
                    
                    <Form.Control as="textarea" required style={{width:1000}} resize="none" rows={25}style={{resize:'none', width:"100%"}} ref={contentRef}/>
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
                    required
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
                    {showNote
                    ?<Alert variant="info" className="w-100" onClose={()=>setShowNote(false)} dismissable><Alert.Heading>Tip</Alert.Heading><p>You can use HTML Tags to format your content (ex. {special[0]}b{special[1]} for <b>bold</b>)</p></Alert>
                    :<Button onClick={()=>{setShowNote(true)}}>Show Tip</Button>
                    }  
                </Jumbotron>
               </Col> 

               </Row>                                         
           </Col>
          

        </>
    )
}
