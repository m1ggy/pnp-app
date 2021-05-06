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
              <Home />
            </Route>
            <Route path='/maps'>
              <Maps />
            </Route>
            <Route path='/news-and-events/news'>
              <News />
            </Route>
            <Route path='/news-and-events/events'>
              <Events />
            </Route>
            <Route path='/news-and-events/others'>
              <Others />
            </Route>
            <Route path='/news-and-events/:id'>
              <PostEntry />
            </Route>
            <Route path='/news-and-events'>
              <NewsAndEvents />
            </Route>
            <Route path='/downloads'>
              <Downloads />
            </Route>
            <Route path='/gallery/:id'>
              <GalleryEntry />
            </Route>
            <Route path='/gallery'>
              <GalleryMain />
            </Route>
            <Route path='/contact'>
              <Contact />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
