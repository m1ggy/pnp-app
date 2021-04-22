import {Jumbotron, Col, Row, Container, Form, Button, Spinner, Alert} from 'react-bootstrap'
import {useEffect, useState, useRef} from 'react'
import uniqid from 'uniqid'
import { storage, firestore, firebase } from '../../firebase/firebase'
import { useAuth } from '../../contexts/AuthContext'
export default function AddNewGallery() {

    const titleRef = useRef()
    const subtitleRef = useRef()
    const storageRef = storage.ref()
    const [images, setImages] = useState([])
    const [preview, setPreview] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState()
    const { currentUser } = useAuth()

    const db = firestore.collection('galleries')
    useEffect(()=>{
        setLoading(true)
        if (!images) {
            setPreview(undefined)
            return
        }
        let tempArray = []
      Array.from(images).forEach((image)=>{
          tempArray.push(URL.createObjectURL(image))
      })
        console.log(tempArray)
        setPreview(tempArray)
      setLoading(false)
        // // free memory when ever this component is unmounted
        // return () => URL.revokeObjectURL(objectUrl)

    },[images])

    function readImages(e){
       
        setImages(e.target.files)
    }

    function RenderPreview(){
        if(preview == null||typeof preview == undefined) return


        return(
            preview.map((image, index)=>{
                return(    
                    <Container key={index} style={{marginTop:50}}>                                                              
                                    <h4>Image {index+1}</h4>
                                    <img src={image} style={{width:"100%",height:"auto"}}/>                  
                        </Container>            
                )
            })
        )
    }

    function pushDataStorage(e){
        setLoading(true)
            e.preventDefault()
        const tempID = uniqid()
        const date = new Date()
        
        Array.from(images).forEach(image=>{
            
            storageRef.child(`galleries/${tempID}/${image.name}`).put(image).then(()=>{
                    getImageURL(tempID, image)
            }).catch(()=>{
                setMessage({type:'danger', msg:'Failed! Failed to upload gallery. Please try again.'})
                return
            })
        })

        db.doc(tempID).set({
            title:titleRef.current.value,
            subtitle:subtitleRef.current.value,
            author: currentUser.email,
            dateUploaded: date.toDateString(),
            timeUploaded: date.toTimeString()
        },{merge:true})

       setMessage({type:'success', msg:'Successfully Uploaded! The Gallery has been uploaded.'})
       setPreview()

        e.target.reset()
        setLoading(false)
    }
    async function pushDataFirestore(url, id){
            

        return await db.doc(id).set({
                imagesURL: firebase.firestore.FieldValue.arrayUnion(url),
        },{merge:true})
    }
    async function getImageURL(id, image){
        return await storageRef.child(`galleries/${id}/${image.name}`).getDownloadURL()
        .then((url)=>{
             pushDataFirestore(url,id)
        })
    }

    return (
        <Col>
            <Row>

            <Jumbotron className="w-100"><h1>Add New Gallery</h1></Jumbotron> 

            </Row>
        <Row>

        </Row>  
        <Row>

            <Jumbotron className="w-100">
            <Row className="w-100">
                 <div className="w-100">
                    <Form className="m-auto" onSubmit={pushDataStorage}>
                    <Form.Group>
                        <Form.Label>
                            Title
                        </Form.Label>
                        <Form.Control type="text" required style={{width:"50%"}} ref={titleRef} className="border"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Subtitle
                        </Form.Label>
                        <Form.Control type="text" required style={{width:"50%"}} ref={subtitleRef} className="border"/>
                    </Form.Group>

                    <Form.Group>
                    <Form.File label="Select Images" required accept="image/*" style={{width:300}} onChange={readImages} multiple/>
                </Form.Group>
                {preview?<Container className="mt-5"><h3>Preview</h3><RenderPreview/></Container>:null}
                {loading&&<Spinner animation="border"/>}
                                
                                    <div className="mt-5">
                                     <Button type="submit">Submit</Button>
                                    </div>
                       
                    </Form>  
                    <div className="mt-5" style={{display:'flex', justifyContent:'center', alignContent:'center', padding:10}}>
                         {message&&<Alert variant={message.type} style={{display:'flex', justifyContent:'center', alignContent:'center'}}><p>{message.msg}</p></Alert>}
                    </div>
                    </div>
                    
            </Row>  
            </Jumbotron>

        </Row>                    
              

            
        </Col>   
    )
}
