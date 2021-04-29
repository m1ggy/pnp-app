import { useParams, Link } from 'react-router-dom'
import { Jumbotron, Col, Row, Breadcrumb,Spinner, Container, Image } from 'react-bootstrap'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import { firestore } from '../firebase/firebase'
import { useEffect, useState } from 'react'


export default function PostEntry() {

    const {id} = useParams()

    const db = firestore.collection('posts').doc(id)

    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState([])


    useEffect(()=>{

        async function getData(){
            setLoading(true)
            let temp = []
            await db.get().then((q)=>{

                if(q.exists){
                    temp.push(q.data())
                }
                setPost(temp)
        })
        setLoading(false)
        }

        getData()
        
    },[])

    function RenderPost(){

        if(post === null||typeof post === 'undefined'){
            return null;
        }

        if(post){
            if(post.length === 0){
                return(
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <p>
                            Cannot find post.
                        </p>
                    </div>
                )
            }
        }

        return(
            post.map((item)=>{
                return(
                    <Row style={{display:'flex', justifyContent:'center'}} key={item.id} className="w-100">

                    <Row className="w-100">
                        <h2>
                            {item.title}
                        </h2>
                        </Row>

                        <Row className="w-100">
                         <Image src={item.url} height="500px" className="m-auto"/>
                        </Row>

                        <Row className="w-100">
                            <p style={{textAlign:'justify'}} className="m-auto">
                                {item.subtitle}
                            </p>
                        </Row>

                        <Row className="w-100 p-5">
                            <p style={{textAlign:'justify'}} className="m-auto">
                                {item.content}
                            </p>
                        </Row>
                        <Row className="w-100">
                            <p style={{textAlign:'justify'}} className="m-auto">
                                {item.date} {item.time}
                            </p>
                        </Row>

                    </Row>
                )
            })
        )
    }

    return (
              <>
        <Col>
        <Row className="w-100">
            <Container style={{marginTop:100}}>
                <NavBarMain className="mt-2 w-100 m-auto"/>
                </Container>
            </Row>

            <Row>
                                     
                                    
                <Row className="w-100">
                    <Jumbotron className="mt-2 w-100" style={{display:'flex', justifyContent:'center'}}>
                    <Row className="w-100" style={{display:"flex", justifyContent:'center'}}>
                        {loading?<Spinner animation="border"/>:<RenderPost/>} 
                       
                    </Row>
                    </Jumbotron>                    
                </Row>

            </Row>
          
                <FooterMain/>   
        </Col>   
        </>
    )
}
