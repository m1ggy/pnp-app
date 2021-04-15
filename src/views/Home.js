import React from 'react'
import Header from '../components/Header'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import { Jumbotron } from 'react-bootstrap'


function Home (){
    return(
        <>
       
            <Header/>
            <NavBarMain/>
            <Jumbotron className="mt-2">
                <h1 className="title">Latest Post</h1>
            </Jumbotron>
            <FooterMain/>
        </>
      
    
    )
}
export default Home