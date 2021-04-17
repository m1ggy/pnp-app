import React, { useState, useEffect } from 'react'
import {Jumbotron, Row, Col, Button, Spinner, Container} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { firestore } from '../../firebase/firebase'

export default function ManagePost() {

    const [posts,setPosts] = useState([])
    const[loading, setLoading] = useState()
    const {currentUser} = useAuth()


    function RenderPosts () {
        return(
            posts.map((post, index)=>{
                return(
                    <Row key={index} className="border p-3"> 

                            <Col lg={10}>
                                <Row><h3>{post.title}</h3></Row>
                                <Row><p><b>Upload Date:</b> {post.date}</p></Row>
                                <Row><p><b>Upload Time:</b> {post.time}</p></Row>
                            </Col>

                            <Col className="m-auto">
                            <Row>
                                <Button variant="primary" size="sm" className="w-75 m-3"><p className="m-auto">Edit</p></Button>
                                <Button variant="danger" size="sm" className="w-75 m-3"><p className="m-auto">Delete</p></Button>
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
    
              await firestore.collection('posts').doc(currentUser.email).collection('events').where('published', '==',true)
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
                await firestore.collection('posts').doc(currentUser.email).collection('news').where('published', '==',true)
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
                 await firestore.collection('posts').doc(currentUser.email).collection('others').where('published', '==',true)
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
                {posts?<RenderPosts/>:null}
                 {loading?<Container><Spinner animation="border" className="m-auto"/></Container>:null}
                </Jumbotron>
            </Row>
       
        </Col>
          
        </>
    )
}
