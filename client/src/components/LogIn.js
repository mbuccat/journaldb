import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { logInSchema } from '../schema';
import API_URL from '../api_url';
import UserContext from '../UserContext';

function LogIn() {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      const logInInput = {
        email: e.target.form.inputEmail.value,
        password: e.target.form.inputPassword.value,
      };
      const isValid = await logInSchema.isValid(logInInput);

      if (isValid) {
        setEmail(logInInput.email);
        setPassword(logInInput.password);
      } else {
        throw new Error();
      }
    } catch (error) {
      setErrorMessage('Error with email or password');
    }
  };

  // when state changes, make post req to api auth route
  useEffect(() => {
    const fetchLogIn = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const responseJSON = await response.json();
        if (responseJSON.error) {
          throw new Error();
        } else {
          localStorage.setItem('token', responseJSON.token);
          setUser({ token: localStorage.token });
        }
      } catch (error) {
        setErrorMessage('Unable to log in');
      }
    };

    if (email && password) fetchLogIn();
  }, [email, password, setUser]);

  return (
    <div className="row">
      {user.token ? <Redirect to="/" /> : null}
      {errorMessage
        ? (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        ) : null}
      <div className="col">
        <form id="form-login">
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" name="email" />

          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />
          <button className="btn btn-lg btn-primary btn-block" type="submit" form="form-login" onClick={handleFormSubmit}>Log in</button>
        </form>
        <Link to="/signup">
          <small>Sign up for an account</small>
        </Link>
      </div>
    </div>
  );
}

export default LogIn;
