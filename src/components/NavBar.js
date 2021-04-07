import React from 'react'
import {BrowserRouter as Router,
        Switch,
        Route,
        NavLink,
        Redirect
} from "react-router-dom";
import Home from '../views/Home'
import Maps from '../views/Maps'
import NewsAndEvents from '../views/NewsAndEvents'
import Downloads from '../views/Downloads'
import Gallery from '../views/Gallery'
import Contact from '../views/Contact'
import Login from '../views/Login'
import '../styles/navbar.css'

function NavBar (){
    return (
        <Router>
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
        <div className="navPage">
        <Switch>
                <Route exact path='/'>
                    <Redirect to="/home"/>
                </Route>
                <Route exact path='/home'>
                    <Home/>
                </Route>
                <Route path='/maps'>
                    <Maps/>
                </Route>
                <Route path='/news-and-events'>
                    <NewsAndEvents/>
                </Route>
                <Route path='/downloads'>
                    <Downloads/>
                </Route>
                <Route path='/gallery'>
                    <Gallery/>
                </Route>
                <Route path='/contact'>
                    <Contact/>
                </Route>
                <Route path='/login'>
                    <Login/>
                </Route>
            </Switch>
            </div>
        </Router>  

       
    )
}

export default NavBar;