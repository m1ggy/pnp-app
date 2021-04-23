import React from 'react'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import '../styles/main.css'
function Contact (){
    return(
        <div className="main">
      
            <NavBarMain/>
            <h1 className="title">Contact</h1>
            <FooterMain/>
        </div>
    )
}
export default Contact