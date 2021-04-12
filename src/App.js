import './App.css';
import Header from './components/Header'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import {AuthProvider} from './contexts/AuthContext'
import {Switch, 
        BrowserRouter as Router, 
        Route, Redirect
       } from 'react-router-dom'
import Home from './views/Home'
import Maps from './views/Maps'
import NewsAndEvents from './views/NewsAndEvents'
import Downloads from './views/Downloads'
import Gallery from './views/Gallery'
import Contact from './views/Contact'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import PrivateRoute from './routes/PrivateRoute'

function App() {
  return ( 
    
     <Router>
      <AuthProvider className="App">
      {window.location.pathname!=='/login'&& window.location.pathname!=='/dashboard'?<div><Header/><NavBar/></div>:null}
      
        <Switch>
        <PrivateRoute path="/dashboard" component={Dashboard}/>
       
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
            {window.location.pathname !== '/login'&& window.location.pathname!=='/dashboard'?<Footer/>:null}
            
            </AuthProvider>      
        </Router>  

    
  );
}

export default App;
