import './App.css';
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
import {useEffect} from 'react'
import GA4React, {useGA4React} from 'ga-4-react'
import AddNewPost from './components/dashboard components/AddNewPost'
// import {Button} from 'react-bootstrap'

const ga4react = new GA4React("G-2MRNV52H3Q")

function App() {

    useEffect(()=>{ 
         ga4react.initialize().then(ga4 =>{
            ga4.pageview(window.location.pathname)
        }).catch(e =>{console.log(e)})
    },[])


  return ( 
    <div className="App">
     <Router>
      <AuthProvider>
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
    
            
            </AuthProvider>      
        </Router>  
</div>   
  );
}

export default App;
