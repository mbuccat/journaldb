import React, { useState, useMemo } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UserContext from './UserContext';
import Nav from './components/Nav';
import Home from './components/Home';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Journal from './components/Journal';
import Article from './components/Article';
import Subscriptions from './components/Subscriptions';

const NotFound = () => <div>Page not found</div>;

function App() {
  const [user, setUser] = useState({
    token: localStorage.token,
  });
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={userValue}>
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={LogIn} />
            <Route path="/signup" exact component={SignUp} />
            <Route path="/journals/:journalID" exact component={Journal} />
            <Route path="/journals/:journalID/:articleID" exact component={Article} />
            <Route path="/subscriptions" exact component={Subscriptions} />
            <Route component={NotFound} />
          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
