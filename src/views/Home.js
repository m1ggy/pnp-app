import React, {useState, useEffect} from 'react'
import Header from '../components/Header'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import { Jumbotron, Row, Col, Spinner, Image, Container, Button } from 'react-bootstrap'
import { firestore } from '../firebase/firebase'

function Home (){

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
       

        async function getData(){
            let tempArray = []
            setLoading(true)
         await firestore.collectionGroup('events').where('published', '==',true).get().then(
             querySnapshot=>{
                if(querySnapshot.empty){               
                    return
                }

                querySnapshot.forEach(doc=>{
                    tempArray.push(doc.data())
                })
             }
         )
         await firestore.collectionGroup('news').where('published', '==',true).get().then(
            querySnapshot=>{
               if(querySnapshot.empty){               
                   return
               }

               querySnapshot.forEach(doc=>{
                    tempArray.push(doc.data())
               })
            }
        )
        await firestore.collectionGroup('others').where('published', '==',true).get().then(
            querySnapshot=>{
               if(querySnapshot.empty){
                   return
               }

               querySnapshot.forEach(doc=>{
                    tempArray.push(doc.data())
               })
            }
        )
         setPosts(tempArray)
        setLoading(false)
        }

        getData()

        
    }, [])

    

    function RenderPosts(){
        if(posts){
            return(
                        posts.map((post, index)=>{
                            return(
                               <Row className="w-100 bg-light" style={{height:250}} key={index} >
                                <div className="m-auto">
                                    <Row className="w-100 m-auto">
                                        <h3>
                                            {post.title}
                                        </h3>
                                    </Row>   
                                    <Row className="w-100 m-auto">
                                        <p>
                                            {post.subtitle}
                                        </p>
                                    </Row>    
                                    <Row className=" w-100 m-auto">
                                        {post.imageURL?<Image src={post.imageURL} width="75%" height="50%"/>:null}
                                    </Row>    
                                    <Row className="w-100 m-auto">
                                    <div className="m-auto">
                                        <Button variant="primary" style={{height:50}}>Read</Button>
                                        </div>
                                    </Row> 
                                 </div>
                                </Row>                               
                            )
                        })
                    )
                }
        else{
            return(
                <Container>
                    <p>No Posts</p>
                </Container>
            )
        }
           
    }

    return(
        <>
        <Col>
        <Row>
        <Header className="mt-2 w-100"/>
        </Row>
        <Row className="w-100">

        <Container>
            <NavBarMain className="mt-2 w-100 m-auto"/>
        </Container>
        
        </Row>
            <Row>
            <Jumbotron className="mt-2 w-100">
                <h1 className="title">Latest Post</h1>
            </Jumbotron>
            </Row>
            <Row>
                    <Container>
                        {posts&&<RenderPosts/>}
                        {loading?<Spinner animation="border" className="m-auto"/>:null}
                    </Container>     
            </Row>
            
                     
             <FooterMain/>             
            </Col>
        </>
      
    )
}
export default Home