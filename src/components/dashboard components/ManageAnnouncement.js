import React, {useState, useEffect} from 'react'
import { Jumbotron, Row, Col, Button, ButtonGroup, Spinner } from 'react-bootstrap'

import { firestore } from '../../firebase/firebase'



export default function ManageAnnouncement() {

    const [announcement, setAnnouncement] = useState([])
    const [loading, setLoading] = useState(false)
    const db = firestore.collection('announcements')

useEffect(()=>{

    async function getData(){
        setLoading(true)
        let tempArray = []

        await db.get().then((snap)=>{
            if(snap.empty){
                return setAnnouncement([])
            }

            snap.forEach(doc=>{
                    tempArray.push(doc.data())
            })
            console.log(tempArray)
            setAnnouncement(tempArray)
        })

        setLoading(false)
    }

    getData()

}, [])
    return (
       <>
       <Col>

        <Row>
            <Jumbotron className="w-100">
                <h1>
                    Manage Announcement
                </h1>
            </Jumbotron>
        </Row>
        <Row>
            <Jumbotron className="w-100">
               {loading&&<Spinner animation="border"/>}
               {announcement?null:<p>No Announcements</p>}
            </Jumbotron>
        </Row>

       </Col>
       </>
    )

}
