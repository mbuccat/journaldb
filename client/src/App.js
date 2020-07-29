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

const DefaultContainer = () => (
  <div>
    <Nav />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/journals/:journalID" exact component={Journal} />
      <Route path="/journals/:journalID/:articleID" exact component={Article} />
      <Route path="/subscriptions" exact component={Subscriptions} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

const LogInContainer = () => (
  <div>
    <Route path="/login" exact component={LogIn} />
  </div>
);

const SignUpContainer = () => (
  <div>
    <Route path="/signup" exact component={SignUp} />
  </div>
);

function App() {
  const [user, setUser] = useState({
    token: localStorage.token,
  });
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router basename="journalbase/">
      <div className="App">
        <UserContext.Provider value={userValue}>
          <Switch>
            <Route path="/login" exact component={LogInContainer} />
            <Route path="/signup" exact component={SignUpContainer} />
            <Route component={DefaultContainer} />
          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
