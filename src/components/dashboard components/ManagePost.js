import React, { useState, useEffect } from 'react'
import {Jumbotron, Row, Col, Button, Spinner, Container, Image} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { firestore} from '../../firebase/firebase'

export default function ManagePost() {

    const [posts,setPosts] = useState([])
    const[loading, setLoading] = useState()
   const db = firestore.collection('posts')


    function RenderPosts () {

        if(posts.length === 0){
            return (
                <Container>
                    <p>
                        No Published Posts.
                    </p>
                </Container>
            )
        }

        return(
            posts.map((post, index)=>{
                return(
                    <Row key={index} className="border p-3"> 

                            <Col lg={10}>
                                <Row><h3>{post.title}</h3></Row>
                                <Row><div className="m-3">{post.url?<Image src={post.url} width="200px" height="100%"/>:<p>No Image :(</p>}</div></Row>
                                <Row><p><b>Upload Date:</b> {post.date}</p></Row>
                                <Row><p><b>Upload Time:</b> {post.time}</p></Row>
                            </Col>

                            <Col className="m-auto">
                            <Row>
                                <Button variant="primary" size="sm" className="m-3 w-75">Edit</Button>
                                <Button variant="danger" size="sm" className="m-3 w-75">Delete</Button>
                            </Row>
                           
                                
                               
                            </Col>             
                    </Row>           
                )
            })
        )
    }
   

    useEffect(()=>{

        async function getData(){
            
            let postsArray = []
            
            setLoading(true)
    
              await db.where('published', '==',true)
               .get()
               .then((querySnapshot)=>{
                    if(querySnapshot.empty){
                        console.log('No matching documents.')
                        return;
                    }

                    querySnapshot.forEach(doc=>{
                        if(doc.exists){
                            console.log(doc.data())
                            postsArray.push(doc.data())
                        }
                        else{
                            console.log('empty')
                        }
                    })
                }).catch(e=>{
                    console.log("Errors: "+e)
                })
               
               setPosts(postsArray)
            
                setLoading(false)          
        }

        getData()

    }, [])

    return (
        <>
        <Col>
            <Row>
             <Jumbotron className="w-100"><h1>Manage Posts</h1></Jumbotron> 
            </Row>
            <Row>
                <Jumbotron className="w-100">

                    <Container>

                        <Container>{loading?<Spinner animation="border" className="m-auto"/>:<RenderPosts/>}</Container>

                    </Container>
               
                </Jumbotron>
            </Row>
       
        </Col>
          
        </>
    )
}
