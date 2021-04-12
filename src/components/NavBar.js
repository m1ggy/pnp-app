import React from 'react'
import {    
        NavLink     
} from "react-router-dom";

import '../styles/navbar.css'

function NavBar (){
    return (

        <div className="navBar">
            <div id="wrapperNavBar">
               <nav>
                    <NavLink to='/home' activeClassName="listNavBarActive" className="listNavBarItem"> Home</NavLink>
                    <NavLink to='/maps' activeClassName="listNavBarActive" className="listNavBarItem">Map</NavLink>              
                    <NavLink to='/news-and-events' activeClassName="listNavBarActive" className="listNavBarItem">News and Events</NavLink>              
                    <NavLink to='/downloads' activeClassName="listNavBarActive" className="listNavBarItem">Downloads</NavLink>              
                    <NavLink to='/gallery' activeClassName="listNavBarActive" className="listNavBarItem">Gallery</NavLink>               
                    <NavLink to='/contact' activeClassName="listNavBarActive" className="listNavBarItem">Contact</NavLink>
               </nav>  
            </div>
        </div>
       
    )
}

export default NavBar;