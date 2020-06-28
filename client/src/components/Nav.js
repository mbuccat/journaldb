import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

function Nav() {
  const { user, setUser } = useContext(UserContext);

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    setUser({ token: null });
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link to="/">
        <span className="navbar-brand mb-0 h1">Navbar</span>
      </Link>
      <ul>
        {user.token && (
        <Link to="/subscriptions">
          <li>Your subscriptions</li>
        </Link>
        )}

        {user.token
          && <li><button type="button" onClick={handleLogOut}>Log Out</button></li>}

        {!user.token
        && (
        <Link to="/login">
          <li>Log In</li>
        </Link>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
