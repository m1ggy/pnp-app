import React, {useEffect, useState} from 'react'

import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import { Jumbotron, Row, Col, Container, Spinner, Button } from 'react-bootstrap'
import { firestore } from '../firebase/firebase'


function Downloads (){

const [downloads, setDownloads] = useState()
const [loading, setLoading] = useState()

const db = firestore.collection('downloads')


function RenderDownloads(){
    if(downloads == null) return

    return(
        downloads.map((data, index)=>{
            const d = Object.keys(data.data)
            return(
                <Container key={index} className="border m-3 p-5">
                    <div className="m-3">
                        {data.id === 'bidsAndArchives'?<h3>Bids And Archives</h3>:null}
                        {data.id === 'generalDownloads'?<h3>General Downloads</h3>:null}
                        {data.id === 'transparencySeal'?<h3>Transparency Seal</h3>:null}
                    </div>
                        <RenderEachDownload data={data.data} listKey={d}/>
                </Container>
            )
        })
    )
}
function RenderEachDownload({data, listKey}){
    if(data == null|| typeof data == undefined){
        return (<p>No Items inside</p>)
    }

    return (
        listKey.map((item, index)=>{
           
            return(
                <Container key={data[`${item}`].id+index} className="p-3 border">
                <Row>
               
                    <Col lg={10}>
                     <p style={{fontWeight:'bold', fontSize:16}}>{data[`${item}`].name}</p>
                     </Col>
                    <Col lg={2}>
                        <Container className="w-100">
                            <Button variant="link" href={data[`${item}`].url}>
                                Download
                            </Button>
                        </Container>
                    </Col>
                
                  </Row>
                </Container>    
            )
        })
    )
}



useEffect(()=>{

    setLoading(true)

    async function getData(){

        let tempArray = []

        await db.get().then((snapshot)=>{
            if(snapshot.empty) return

            snapshot.forEach(doc=>{
             tempArray.push({id:doc.id,data:doc.data()})
            })
            console.log(tempArray)
            setDownloads(tempArray)
        })
    }
    getData()

    setLoading(false)

},[])
    return(

        <>
        <Col>

            <Row className="w-100">
                <Container style={{marginTop:100}}>
                    <NavBarMain className="mt-2 w-100 m-auto"/>
                </Container>
            </Row>

            <Row>
                <Jumbotron className=" mt-2 w-100">
                    <h1 className="title">Downloads</h1>     
                </Jumbotron>  
            </Row>

            <Row>
            <Jumbotron className="w-100">
                <Container>
                    {loading&&<Spinner animation="border"/>}
                    {downloads&&<RenderDownloads/>}
                </Container>
                </Jumbotron>
            </Row>

            <Row>
                <FooterMain/>   
            </Row>
        </Col>
       
           
       
       
    </>
    )
}
export default Downloads