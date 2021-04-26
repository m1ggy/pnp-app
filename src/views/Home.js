import React, {useState, useEffect} from 'react'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import { Jumbotron, Row, Col, Spinner, Image, Container, Button } from 'react-bootstrap'
import { firestore } from '../firebase/firebase'



function Home (){

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const db = firestore.collection('posts')
    

    useEffect(()=>{
       
        window.gtag('config', 'G-2MRNV52H3Q', { 'page_title': document.title, page_path: window.location.pathname + window.location.search })

        async function getData(){
            let tempArray = []
            setLoading(true)
         await db.where('published', '==',true).get().then(
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
        if(posts=== null||typeof posts === undefined)return null;

        if(posts){
            if(posts.length === 0){
                return(
                    <div style={{display:'flex', justifyContent:"center"}}>
                        <p>No Published Posts</p>
                    </div>
                )
            }
        }
            return(
                    posts.map((post, index)=>{  
                            
                        return(
                            <Row className="w-100 p-3 border" style={{height:"25%"}} key={index} >
                               
                            <Col lg={3} className="border">
                                    
                                <div style={{display:'flex', justifyContent:'center', alignContent:'center'}}>
                                    {post.url?<Image src={post.url} width="200px" height="100%"/>:<p>NO IMAGE</p>}
                                </div>
                                  
                            </Col>

                            <Col lg={9}>
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
                                <Row className="w-100 m-auto">
                                    <p style={{fontSize:15}}>
                                        {post.date}
                                    </p>
                                </Row>    
                                       
                                <Row className="w-100 m-auto">
                                    <div className="m-auto">
                                        <Button variant="primary" style={{height:50}}>Read</Button>
                                    </div>
                                    </Row> 
                                </Col>
                                   
                            </Row>                               
                            )
                        })
                    )                     
    }

    return(
        <>
        <Col>

        <Row className="w-100">

        <Container style={{marginTop:100}}>
            <NavBarMain className="mt-2 w-100 m-auto"/>
        </Container>
        
        </Row>
            <Row>
            <Jumbotron className="mt-2 w-100">
                <h1 className="title">Latest Post</h1>
            </Jumbotron>
            </Row>
            <Row>
            <Jumbotron className="mt-2 w-100">
                    <Container>
                        {posts&&<RenderPosts/>}
                        {loading?<Spinner animation="border" className="m-auto"/>:null}
                    </Container>  
                    </Jumbotron>   
            </Row>
            
                     
             <FooterMain/>             
            </Col>
        </>
      
    )
}
export default Home