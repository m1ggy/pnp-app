import React from 'react'
import Header from '../components/Header'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'


function Home (){
    return(
        <>
       
            <Header/>
            <NavBarMain/>
            <h1 className="title">Latest Post</h1>
            <FooterMain/>
        </>
      
    
    )
}
export default Home