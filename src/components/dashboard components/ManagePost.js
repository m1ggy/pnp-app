import React, { useState, useEffect } from 'react'
import {Jumbotron, Row, Col, Button, Spinner, Container, Image, Modal, ButtonGroup} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { firestore, storage} from '../../firebase/firebase'

export default function ManagePost() {

    const [posts,setPosts] = useState([])
    const[loading, setLoading] = useState()
    const [selectedItem, setSelectedItem] = useState()
    const [showModal, setShowModal] = useState(false)
    const [message, setMessage] = useState()
    const [showMessageModal, setShowMessageModal] = useState(false)
    const db = firestore.collection('posts')
    const storageRef = storage.ref('images')


    function RenderPosts () {

        if(posts.length === 0){
            return (
                <Container>
                    <p>
                        No Published Posts.
                    </p>
                </Container>
            )
        }

        return(
            posts.map((post, index)=>{
                return(
                    <Row key={index} className="border p-3"> 

                            <Col lg={10}>
                                <Row><h3>{post.title}</h3></Row>
                                <Row><div className="m-3">{post.url?<Image src={post.url} width="200px" height="100%"/>:<p>No Image :(</p>}</div></Row>
                                <Row><p><b>Upload Date:</b> {post.date}</p></Row>
                                <Row><p><b>Upload Time:</b> {post.time}</p></Row>
                            </Col>

                            <Col className="m-auto">
                            <Row>
                                <Button variant="primary" size="sm" className="m-3 w-75">Edit</Button>
                                <Button variant="danger" size="sm" className="m-3 w-75" onClick={()=>{setShowModal(true);setSelectedItem(post)}}>Delete</Button>
                            </Row>
                           
                                
                               
                            </Col>             
                    </Row>           
                )
            })
        )
    }
   

    useEffect(()=>{

        getData()

    }, [])

    async function getData(){
            
        let postsArray = []
        
        setLoading(true)

          await db.where('published', '==',true)
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
                    else{
                        console.log('empty')
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

    return (
        <>
        <Col>
            <Row>
             <Jumbotron className="w-100"><h1>Manage Posts</h1></Jumbotron> 
            </Row>
            <Row>
                <Jumbotron className="w-100">

                    <Container>

                       {loading?<Spinner animation="border" className="m-auto"/>:<RenderPosts/>}
                        <DeleteModal/>
                        <MessageModal/>
                    </Container>
               
                </Jumbotron>
            </Row>
       
        </Col>
          
        </>
    )
}
