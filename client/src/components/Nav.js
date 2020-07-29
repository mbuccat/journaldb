import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import person from '../assets/person.svg';

function Nav() {
  const { user, setUser } = useContext(UserContext);

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    setUser({ token: null });
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <span className="navbar-brand mb-0 h1 font-weight-bold">JournalBase</span>
      </Link>
      <ul className="navlinks">
        {user.token && (
        <Link to="/subscriptions">
          <li><img src={person} alt="person-icon" width="32" height="32" title="person-icon" /></li>
        </Link>
        )}

        {user.token
          && <li><button className="btn btn-outline-dark btn-sm" type="button" onClick={handleLogOut}>Log Out</button></li>}

        {!user.token
        && (
        <Link className="Link" to="/login">
          <li className="btn btn-outline-dark btn-sm">Log In</li>
        </Link>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
