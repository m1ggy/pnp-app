import React, {useEffect, useState} from 'react'
import { Jumbotron, Col, Row, Container, Spinner, Button} from 'react-bootstrap'
import { firestore } from '../../firebase/firebase'


export default function ManageDownloads() {

    const db = firestore.collection('downloads')
    const [loading, setLoading] = useState(false)
    const [downloads, setDownloads] = useState()
    const [downloadType, setDownloadType] = useState()
   

 

    useEffect(()=>{

        async function getDownloads(){
            await db.get().then(
                (querySnapshot=>{
                    if(querySnapshot.empty){
                        setDownloads()
                        return;
                    }
                    let tempArray = []
                    let idArray = []
                    querySnapshot.forEach(doc=>{
                        idArray.push(doc.id)
                        tempArray.push(doc.data())
                    })
                    setDownloads(tempArray)
                    setDownloadType(idArray)
                })
            )
        }

        setLoading(true)     
        getDownloads()
        setLoading(false)

    }, [])

    function RenderDownloads (){
if(downloads){
       return downloads.map((item, index)=>{
          let extracted = Object.keys(item)
          
            return extracted.map(dl=>{
                console.log(item[`${dl}`].name)
                return (
                    <Row key={index+item[`${dl}`].id} className="border" >
                          
                        <Col lg={8}>
                        <Container className="m-5">
                            <div>
                            <p style={{fontSize:20, fontWeight:'bold'}}>{item[`${dl}`].name}</p>                  
                            <p style={{fontSize:15, fontWeight:'bold'}}>Category: {item[`${dl}`].type.label}</p>
                            <p style={{fontSize:15, fontWeight:'bold'}}>ID:{item[`${dl}`].id}</p>
                            <a href={item[`${dl}`].url}>Link to File</a>
                            </div>
                        </Container>
                        </Col>    
                        <Col lg={4}>
                        <Container className="w-100" style={{height:'100%'}}>
                            <div className="m-auto">
                                <Button variant="danger" size="sm">
                                    Delete
                                </Button>
                            </div> 
                            </Container>             
                        </Col>                                                          
                        
                    </Row>
                )
            })
       })
    }

    return(
        <Container>
            <p className="m-auto">No Downloads</p>
        </Container>
    )
    
}


    return (
        <>
        <Col>
        <Row>
         <Jumbotron className="w-100"><h1>Manage Downloads</h1></Jumbotron> 
        </Row>
        <Row>

        </Row>  
        <Row>

            <Jumbotron className="w-100">
                <Container>
                <div className="m-auto">

                    {loading?<Spinner animation="border"/>:null}
                    {downloads?<RenderDownloads/>:null}

                </div>
                </Container>
            </Jumbotron>

        </Row>                    
              

            
        </Col>   
       
        </>
    )
}
