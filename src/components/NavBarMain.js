import React from 'react'
import {    
        NavLink     
} from "react-router-dom";
import {Navbar} from 'react-bootstrap'
import '../styles/navbar.css'
function NavBarMain (){
    return (
       
            <Navbar>
            <div className="mx-auto">
                <NavLink to='/home' className="listNavBarItem" activeClassName="listNavBarActive"> Home</NavLink>
                <NavLink to='/maps' className="listNavBarItem" activeClassName="listNavBarActive">Map</NavLink>              
                <NavLink to='/news-and-events' className="listNavBarItem" activeClassName="listNavBarActive">News and Events</NavLink>              
                <NavLink to='/downloads' className="listNavBarItem" activeClassName="listNavBarActive">Downloads</NavLink>              
                <NavLink to='/gallery' className="listNavBarItem" activeClassName="listNavBarActive">Gallery</NavLink>               
                <NavLink to='/contact' className="listNavBarItem" activeClassName="listNavBarActive">Contact</NavLink>
                </div> 
            </Navbar>    
               
    )
}

export default NavBarMain;