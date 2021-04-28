import React, {useState, useEffect, useRef} from 'react'
import { Jumbotron, Row, Col, Form, Button, Container, Modal, Alert, Spinner } from 'react-bootstrap'
import uniqid from 'uniqid'
import { firestore } from '../../firebase/firebase'
import { useAuth } from '../../contexts/AuthContext'


export default function AddNewAnnouncement() {

    const [message, setMessage] = useState()
    const [disable, setDisable] = useState(false)
    const db = firestore.collection('announcements')
    const titleRef = useRef()
    const contentRef = useRef()

    const { currentUser } = useAuth()

    function handleSubmit(e){
        setMessage()
        setDisable(true)
            e.preventDefault()
            pushData()
            e.target.reset()

        setDisable(false)

    }

   async function pushData(){
      

        const date = new Date()
        const tempID = uniqid()

      await db.doc(tempID).set({
            author:currentUser.email,
            title:titleRef.current.value,
            content:contentRef.current.value,
            dateUploaded:date.toDateString(),
            timeUploaded:date.toTimeString()
        },{merge:true}).then(()=>{
            setMessage({type:'success', msg:'Announcement has been added!'})
        }).catch((e)=>{
            setMessage({type:'danger', msg:`Error: ${e}`})
        })
        
    }

    return (
       <>
       <Col>

        <Row>
            <Jumbotron className="w-100">
                <h1>
                    Add New Announcement
                </h1>
            </Jumbotron>
        </Row>
        <Row>
            <Jumbotron className="w-100">

                <Container>

                    <Form onSubmit={(e)=>handleSubmit(e)}>
                        <Form.Group>
                        <Form.Label>
                        Announcement Title
                        </Form.Label>
                         <Form.Control type="text" placeholder="Title" required style={{width:"75%"}} ref={titleRef} className="border"/>
                        </Form.Group>

                        <Form.Group>
                        <Form.Label>
                        Announcement Content
                        </Form.Label>
                         <Form.Control as="textarea" placeholder="Content" required rows={15}style={{resize:'none', width:"100%"}} ref={contentRef} className="border"/>
                        </Form.Group>

                            <div style={{display:'flex', justifyContent:"center"}}>
                            <Button variant="primary" type="submit" className="m-auto" size="md" disabled={disable}>
                                Submit
                            </Button>
                            </div>
                    </Form>
                    {message&&<Alert variant={message.type} className="mt-5">{message.msg}</Alert>}
                </Container>

            </Jumbotron>
        </Row>

       </Col>
       </>
    )

}
