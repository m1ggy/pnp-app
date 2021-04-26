import React, {useEffect, useState} from 'react'
import { Jumbotron, Col, Row, Spinner, Container, Button, Modal, ButtonGroup} from 'react-bootstrap'
import { firestore, storage } from '../../firebase/firebase'

export default function Drafts() {

    const [posts,setPosts] = useState([])
    const[loading, setLoading] = useState()
    const [selectedItem, setSelectedItem] = useState()
    const [showModal, setShowModal] = useState(false)
    const [message, setMessage] = useState()
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [publishModal, setPublishModal] = useState(false)

    const db = firestore.collection('posts')
    const storageRef = storage.ref('images')


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
                    <Row key={index} className="border p-3"> 

                            <Col lg={10}>
                                <Row><h3>{post.title}</h3></Row>
                                <Row><p><b>Upload Date:</b> {post.date}</p></Row>
                                <Row><p><b>Upload Time:</b> {post.time}</p></Row>
                            </Col>

                            <Col className="m-auto">
                                <Row>
                                    <Button variant="primary" size="sm" className="m-3 w-75" onClick={()=>{setPublishModal(true);setSelectedItem(post)}}>Publish</Button>
                                    <Button variant="info" size="sm" className="m-3 w-75">Edit</Button>                 
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
            <Jumbotron className="w-100" style={{display:'flex', justifyContent:'center'}}>
               
                 {posts?<RenderPosts/>:<p>No posts in drafts.</p>}
                 {loading?<Container><Spinner animation="border" className="m-auto"/></Container>:null}
                <DeleteModal/>
                <MessageModal/>
                <PublishModal/>
            </Jumbotron>     
          
            </Row>

         </Col>
     </>
    )
}
