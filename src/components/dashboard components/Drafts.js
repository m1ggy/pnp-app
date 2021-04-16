import React, {useEffect, useState} from 'react'
import { Jumbotron, Col, Row, Spinner } from 'react-bootstrap'
import { firestore } from '../../firebase/firebase'
import { useAuth } from '../../contexts/AuthContext'
export default function Drafts() {

    const {currentUser} = useAuth()
    const [data,setData] = useState([])
    const[loading, setLoading] = useState()

    function getData(){
        setLoading(true)

        let postsArray = []

        firestore.collection('posts').where('author', '==', `${currentUser}`).get().then(snap=>{
            snap.forEach(doc=>{
                postsArray.push(doc.data())
                console.log(postsArray)
            })
            setData(postsArray)       
        }).catch(e=>{return console.log(e)})  
        setLoading(false)
    }

    function RenderDrafts(){
        
            return(
                data.map((post, index) =>{
                    return(
                        <p key={index}>
                           {post.title}
                           {index}
                        </p>
                    )
                })
            )
        
       
    }

    useEffect(()=>{
        getData()
    }, [])


    return (
        <>
        <Col> 

            <Row>
                <Jumbotron className="w-100"><h1>Drafts</h1></Jumbotron> 
            </Row> 

            <Row>
                {loading&&data?<Spinner animation="grow"/>:<RenderDrafts/>}
          
            </Row>

         </Col>
     </>
    )
}
