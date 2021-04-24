import React, {useEffect, useState} from 'react'
import { Jumbotron, Col, Row, Spinner, Container, Button} from 'react-bootstrap'
import { firestore } from '../../firebase/firebase'
import { useAuth } from '../../contexts/AuthContext'
export default function Drafts() {

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
                                <Button variant="primary" size="sm" className="m-3 w-75">Publish</Button>
                                <Button variant="info" size="sm" className="m-3 w-75">Edit</Button>                 
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
    
              await firestore.collection('posts').doc(currentUser.email).collection('events').where('published', '==',false)
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
                await firestore.collection('posts').doc(currentUser.email).collection('news').where('published', '==',false)
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
                 await firestore.collection('posts').doc(currentUser.email).collection('others').where('published', '==',false)
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
                <Jumbotron className="w-100"><h1>Drafts</h1></Jumbotron> 
            </Row> 

            <Row>
            <Jumbotron className="w-100">
                <Container>
                 {posts?<RenderPosts/>:null}
                 {loading?<Container><Spinner animation="border" className="m-auto"/></Container>:null}
                </Container>
            </Jumbotron>
               
          
            </Row>

         </Col>
     </>
    )
}
