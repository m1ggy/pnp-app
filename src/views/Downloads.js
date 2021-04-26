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

    let types = [
        {type:'advisories',label:'Advisory'}, 
        {type:'bidsAndArchives',label:'Bids and Archives'}, 
        {type:'generalDownloads',label:'General Downloads'}, 
        {type:'transparencySeal', label:'Transparency Seal'}
            ]

    if(downloads == null) return;

    return types.map((type, index)=>{
          let filtered = downloads.filter((item)=>{
               return item.id == type.type
           })
           return(
            <Container key={type.type+index} className="border p-5">
                     <h3>{type.label}</h3>
                     <RenderEachDownload data={filtered} label={type.label}/>
            </Container>
        )
    })


}

function RenderEachDownload({data, label}){
    if(data == null|| typeof data == undefined){
        return (<p>No Items inside</p>)
    }
    else if(data.length<1){
        return (
            <p>{label} is empty.</p>
        )
    }
    return (
       data.map((item, index)=>{
            return(
                <Container key={item.id+index} className="p-3 border">
                <Row>
               
                    <Col lg={10}>
                     <p style={{fontWeight:'bold', fontSize:16}}>{item.data.name}</p>
                     <p style={{fontSize:13}}>{item.data.size} MB</p>
                     </Col>
                    <Col lg={2}>
                       
                            <Button variant="primary" href={item.data.url}>
                                Download
                            </Button>
                        
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
             tempArray.push({id:doc.data().type.value,data:doc.data()})
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
                    {downloads?<RenderDownloads/>:<div style={{display:'flex', justifyContent:'center'}}><p>No Downloads</p></div>}
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