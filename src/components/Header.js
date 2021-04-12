import React from 'react'
import {Container, Image, Row} from 'react-bootstrap'
function Header(){
    return(
        <Container fluid className="justify-content-md-center">
             <Row className="d-flex justify-content-center mt-4">
                <div>
                <Image/>
                    <img id="PNPLogo" src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Philippine_National_Police_seal.svg/1200px-Philippine_National_Police_seal.svg.png' alt="PNP Logo"/>
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