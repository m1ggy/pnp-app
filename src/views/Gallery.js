import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import { Jumbotron, Row, Col, Button, Spinner, Container } from 'react-bootstrap'

function Gallery (){
    return(
        <>
        <Col>

            <Row>
                <Header  className="mt-2 w-100"/>
            </Row>

            <Row className="w-100">
            <Container>
                <NavBarMain className="mt-2 w-100 m-auto"/>
                </Container>
            </Row>

            <Row>

                <Row className="w-100">
                    <Jumbotron className="mt-2 w-100">
                        <h1 className="title">Gallery</h1>  
                    </Jumbotron>
                </Row>

                <Row>

                </Row>

            </Row>

          
                <FooterMain/>                             
        </Col>
    </>
    )
}
export default Gallery