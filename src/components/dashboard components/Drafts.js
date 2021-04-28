import React, {useEffect, useState, useRef} from 'react'
import { Jumbotron, Col, Row, Spinner, Container, Button, Modal, ButtonGroup, Form, Image} from 'react-bootstrap'
import { firestore, storage } from '../../firebase/firebase'
import Select from 'react-select'
import '../../styles/drafts.css'

export default function Drafts() {

    const [posts,setPosts] = useState([])
    const[loading, setLoading] = useState()
    const [selectedItem, setSelectedItem] = useState()
    const [showModal, setShowModal] = useState(false)
    const [message, setMessage] = useState()
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [publishModal, setPublishModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const types = [
        {value:'news', label:'News'},
        {value:'events',label:'Events'},
        {value:'others',label:'Others'}
    ]

    const db = firestore.collection('posts')
    const storageRef = storage.ref('images')

    const titleRef = useRef()
    const subtitleRef = useRef()
    const contentRef = useRef()
    const imageRef = useRef()
    const typeRef = useRef()

    function RenderPosts (){
        if(posts === null|| typeof posts === undefined) return null;

        if(posts){
            if(posts.length === 0){
                return(
                    <p>No posts in drafts.</p>
                )
            }
        }

        return(
            posts.map((post, index)=>{
                return(
                    <Row key={index} className="border p-3 w-100"> 

                            <Col lg={10}>
                                <Row><h3>{post.title}</h3></Row>
                                <Row><div className="m-3">{post.url?<Image src={post.url} width="200px" height="100%"/>:<p>No Image :(</p>}</div></Row>
                                <Row><p><b>Upload Date:</b> {post.date}</p></Row>
                                <Row><p><b>Upload Time:</b> {post.time}</p></Row>
                               
                            </Col>

                            <Col className="m-auto">
                                <Row>
                                    <Button variant="primary" size="sm" className="m-3 w-75" onClick={()=>{setPublishModal(true);setSelectedItem(post)}}>Publish</Button>
                                    <Button variant="info" size="sm" className="m-3 w-75" onClick={()=>{setEditModal(true);setSelectedItem(post)}}>Edit</Button>                 
                                    <Button variant="danger" size="sm" className="m-3 w-75" onClick={()=>{setShowModal(true);setSelectedItem(post)}}>Delete</Button>
                                </Row>                                                                           
                            </Col>             
                    </Row>           
                )
            })
        )
    }

    
    async function getData(){
            
        let postsArray = []
        
        setLoading(true)

          await db.where('published', '==', false)
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
                })
            }).catch(e=>{
                console.log("Errors: "+e)
            })

           setPosts(postsArray)
        
        setLoading(false)          
    }

    const handleCloseModal = () =>{
        setShowModal(false)
    }

    function deletePost(item){

        handleCloseModal()

        const deleteTask = storageRef.child(`${item.id}`)
        console.log(item.id)
        deleteTask.delete().then(()=>{
            setMessage({type:'primary', msg:`Deleted ${item.title}`})
        }).catch(()=>{
            setMessage({type:'danger', msg:`Cannot delete ${item.title}`})
        })
    
        db.doc(item.id).delete().then(()=>{
                setMessage({type:'primary', msg:'Successfully deleted post'})
        }).catch(()=>{
            setMessage({type:'danger', msg:'Failed to delete post'})
        })
      
        setSelectedItem()
        setShowMessageModal(true)

    }

    function publishPost(item){
        const date = new Date()
          setPublishModal(false)

            db.doc(item.id).set({
                published:true,
                publishDate:date.toDateString()
            },{merge:true}).then(()=>{
                setMessage({type:'primary', msg:`Post ${item.title} was published!`})
            }).catch(()=>{
                setMessage({type:'danger', msg:`Post ${item.title} was not published. Please try Again.`})
            })

        setSelectedItem()
        setShowMessageModal(true)
    }

    async function editPost(e){
        e.preventDefault()
        console.log(titleRef.current)
        console.log(subtitleRef.current)
        console.log(contentRef.current)
        console.log(imageRef.current)
        console.log(typeRef.current)
        console.log(selectedItem.id)

        await db.doc(selectedItem.id).set({
            title:titleRef.current,
            subtitle:subtitleRef.current,
            content:contentRef.current,
        },{merge:true}).then(()=>{
            setMessage({type:'primary', msg:'Successfully updated post.'})
        })

        if(typeRef.current != null){
            await db.doc(selectedItem.id).set({
               type:typeRef.current
            },{merge:true}).then(()=>{
                setMessage({type:'primary', msg:'Successfully updated post.'})
            })
        }

        if(imageRef.current != null){
            await storageRef.child(selectedItem.id).delete().then(()=>{

                const upload = storageRef.child(`${selectedItem.id}`).put(imageRef.current)

                upload.then(()=>{

                    storageRef.child(selectedItem.id).getDownloadURL().then((url)=>{
                       db.doc(selectedItem.id).set({
                            url
                        },{merge:true}).then(()=>{
                            
                                setMessage({type:'primary', msg:'Successfully updated post.'})
                                
                        })
                    })

                }).catch((e)=>{
                    setMessage({type:'danger', msg:`Error: ${e}`})
                })
            })
        }

        setEditModal(false)
        setShowMessageModal(true)
        titleRef.current = undefined
        subtitleRef.current = undefined
        contentRef.current = undefined
        imageRef.current = undefined
        typeRef.current = undefined
        e.target.reset()
    }
    
    function handleImage(e){
        if(e.target.files[0]){
            imageRef.current = e.target.files[0]
        }
    }

    function EditModal(){
        
        if(selectedItem === null||typeof selectedItem === 'undefined')
        {return null;}


            titleRef.current = selectedItem.title
            subtitleRef.current = selectedItem.subtitle
            contentRef.current = selectedItem.content

        return(
            <Modal 
            show={editModal} 
            onHide={()=>{setEditModal(false)}} 
            centered
            dialogClassName="edit-modal"
            >
                <Modal.Header>
                 <h3>
                    Edit Post
                    </h3>
                </Modal.Header>
                <Modal.Body>

                 <Form onSubmit={editPost}>

                 <Form.Group>
                    <Form.Label>
                    <b>Enter Title</b>
                    </Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Title" 
                    required 
                    style={{width:"50%"}} 
                    className="border" 
                    defaultValue={titleRef.current} 
                    onChange={(event)=>{titleRef.current = event.target.value}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                    <b>Enter Subtitle</b>
                    </Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Subtitle" 
                    required 
                    style={{width:"75%"}} 
                    className="border" 
                    defaultValue={subtitleRef.current} 
                    onChange={(event)=>{subtitleRef.current = event.target.value}}

                    />
                </Form.Group>

                <Form.Group>
                    <Form.File label="Enter Banner Image NOTE: If you don't want to change the image, ignore this." accept="image/*" style={{width:300}} onChange={handleImage}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        <b>Enter Content </b>
                    </Form.Label>
                    
                    <Form.Control 
                    as="textarea" 
                    required 
                    rows={25}
                    style={{resize:'none', width:"100%"}} 
                    className="border" 
                    defaultValue={contentRef.current} 
                    onChange={(event)=>{contentRef.current = event.target.value}}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        Select File Category
                    </Form.Label>
                    <Select options={types} onChange={(e)=>{typeRef.current = e}} styles={{zIndex:100}}/>

                </Form.Group>


               
                <Container className="mt-5">
                    <Button variant="primary" type="submit" className="mt-5 w-25 m-auto" size="md">
                        Submit
                    </Button>
                </Container>
               

                </Form>
                   
                </Modal.Body>
                <Modal.Footer>
                <ButtonGroup>
                    <Button variant="danger" size="sm" className="w-75 m-3" onClick={()=>{setEditModal(false)}}>
                        Cancel
                    </Button>
                    </ButtonGroup>
                   
                </Modal.Footer>
            </Modal>
        )
    }
    

    function DeleteModal(){

        if(selectedItem === null||typeof selectedItem === 'undefined')
        {return null;}
    
        return(
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                 <h3>
                    Are you sure?
                    </h3>
                </Modal.Header>
                <Modal.Body>
                    Do you want to delete {selectedItem.title}?
                </Modal.Body>
                <Modal.Footer>
                <ButtonGroup>
                    <Button variant="primary" size="sm" className="w-75 m-3" onClick={()=>{deletePost(selectedItem)}}>
                        Yes
                    </Button>
                    <Button variant="danger" size="sm" className="w-75 m-3" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    </ButtonGroup>
                   
                </Modal.Footer>
            </Modal>
        )
    }
    function PublishModal(){

        if(selectedItem === null||typeof selectedItem === 'undefined')
        {return null;}
    
        return(
            <Modal show={publishModal} onHide={()=>{setPublishModal(false)}}>
                <Modal.Header>
                 <h3>
                    Are you sure?
                    </h3>
                </Modal.Header>
                <Modal.Body>
                    Do you want to publish {selectedItem.title}?
                </Modal.Body>
                <Modal.Footer>
                <ButtonGroup>
                    <Button variant="primary" size="sm" className="w-75 m-3" onClick={()=>{publishPost(selectedItem)}}>
                        Yes
                    </Button>
                    <Button variant="danger" size="sm" className="w-75 m-3" onClick={()=>{setPublishModal(false)}}>
                        Cancel
                    </Button>
                    </ButtonGroup>
                   
                </Modal.Footer>
            </Modal>
        )
    }

    function MessageModal(){
        if(message=== null||typeof message === 'undefined'){return null}
    
            return(
                <Modal show={showMessageModal} onHide={()=>{setShowMessageModal(false)}}>
                <Modal.Header>
                    {message.type === 'primary'?<h3>Success!</h3>:<h3>Failed!</h3>}
                </Modal.Header>
                <Modal.Body>
                 <p>{message.msg}</p>
                </Modal.Body>
                <Modal.Footer>
                <ButtonGroup>
                <Button variant="primary" size="sm" className="w-75 m-3" onClick={()=>{setShowMessageModal(false);getData()}}>
                       Close
                </Button>
                </ButtonGroup>
                </Modal.Footer>
            </Modal>
            ) 
    }
   

    useEffect(()=>{

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
               
                 {posts?<RenderPosts/>:<p>No posts in drafts.</p>}
                 {loading?<Container><Spinner animation="border" className="m-auto"/></Container>:null}
                <DeleteModal/>
                <MessageModal/>
                <PublishModal/>
                <EditModal/>
            </Jumbotron>     
          
            </Row>

         </Col>
     </>
    )
}
