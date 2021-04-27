import React, {useState, useEffect} from 'react'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import { Jumbotron, Row, Col, Spinner, Image, Container, Button, Pagination } from 'react-bootstrap'
import { firestore } from '../firebase/firebase'



function Home (){

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const db = firestore.collection('posts')
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5)
    const [pageNumbers, setPageNumbers] = useState()



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
         paginateNumbers(tempArray)

        setLoading(false)
        }

        getData()

        function paginateNumbers(arr){

                let temp = []
                let totalPosts = arr.length

            for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
                temp.push(i);
            }
            setPageNumbers(temp)
        }
       

        
    }, [])

    function paginate(num){
        setCurrentPage(num)
    }
    function prevPage(){
        setCurrentPage(currentPage-1)
    }
    function nextPage(){
        setCurrentPage(currentPage+1)
    }

    

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

        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

            return(
                    currentPosts.map((post, index)=>{  
                            
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
                     
                     <div style={{display:'flex', justifyContent:"center", marginTop:15}}>
                   {pageNumbers&&<Pagination>
                        <Pagination.Item onclick={prevPage}>
                            Previous
                        </Pagination.Item>
                        {pageNumbers.map((num, index)=>{
                            return(
                                <Pagination.Item onClick={()=>{paginate(num)}} key={index}>
                                    {num}
                                </Pagination.Item>
                            )
                        })}
                        <Pagination.Item onclick={nextPage}>
                           Next
                        </Pagination.Item>
                   </Pagination>}
                   </div>
                    </Jumbotron>   
            </Row>
            
                     
             <FooterMain/>             
            </Col>
        </>
      
    )
}
export default Home