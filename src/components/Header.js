import React from 'react'
import {Container, Image, Row} from 'react-bootstrap'
import '../styles/header.css'
function Header(){
    return(
        <Container fluid className="justify-content-md-center" style={{marginTop:'125px'}}>
             <Row className="d-flex justify-content-center mt-4">
                <div className="mt-3 mr-3">
                <Image 
                id="PNPLogo" 
                className="m-auto"  
                width="30"
                height="30"
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Philippine_National_Police_seal.svg/1200px-Philippine_National_Police_seal.svg.png' alt="PNP Logo"/>
                    </div>
                    <div id="headerText">
                        <p>Republic of the Philippines</p>
                        <p>Philippine National Police</p>
                        <p>4th District of Laguna</p>
                    </div>
            </Row>
        </Container>
           
     
    ) 
}

export default Header;