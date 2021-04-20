import React, {useEffect, useState} from 'react'
import { Jumbotron, Col, Row, Container, Spinner} from 'react-bootstrap'
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
    if(downloadType){
        if(downloads){
            
            return(
                downloadType.map((type)=>{
                        
                   return downloads.map((item, index)=>{
                        let renderItem =  Object.keys(item)
                      
                       return renderItem.map((render,index)=>{

                        if(item[`${renderItem[0]}`].type === type){
                           
                            return(
                                <Container key={render+index}>
                                    <p>{item[`${renderItem[0]}`].name}</p>
                                    <p>{item[`${renderItem[0]}`].type}</p>
                                </Container>

                            )
                        }
                       })

                    })
                    
                })
            )
        
        }
    }
    return(
        <p>
            No Downloads
        </p>
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
                    {downloads?<RenderDownloads/>:<p>No Downloads</p>}

                </div>
                </Container>
            </Jumbotron>

        </Row>                    
              

            
        </Col>   
       
        </>
    )
}
