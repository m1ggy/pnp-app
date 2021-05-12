import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import Home from './views/Home';
import Maps from './views/Maps';
import NewsAndEvents from './views/NewsAndEvents';
import Downloads from './views/Downloads';
import GalleryMain from './views/GalleryMain';
import Contact from './views/Contact';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import GalleryEntry from './views/GalleryEntry';
import PostEntry from './views/PostEntry';
import News from './views/News';
import Events from './views/Events';
import Others from './views/Others';
import NavBarMain from './components/NavBarMain';
import FooterMain from './components/FooterMain';
import 'bootswatch/dist/lux/bootstrap.min.css';

function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute path='/dashboard' component={Dashboard} />

            <Route exact path='/'>
              <Redirect to='/home' />
            </Route>
            <Route exact path='/home'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <Home />
            </Route>
            <Route path='/maps'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <Maps />
            </Route>
            <Route path='/news-and-events/news'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <News />
            </Route>
            <Route path='/news-and-events/events'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <Events />
            </Route>
            <Route path='/news-and-events/others'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <Others />
            </Route>
            <Route path='/news-and-events/:id'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <PostEntry />
            </Route>
            <Route path='/news-and-events'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <NewsAndEvents />
            </Route>
            <Route path='/downloads'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <Downloads />
            </Route>
            <Route path='/gallery/:id'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <GalleryEntry />
            </Route>
            <Route path='/gallery'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <GalleryMain />
            </Route>
            <Route path='/contact'>
              <NavBarMain className='mt-2 w-100 m-auto' />
              <Contact />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
          </Switch>
          <FooterMain />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
