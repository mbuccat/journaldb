import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { signUpSchema } from '../schema';
import API_URL from '../api_url';
import UserContext from '../UserContext';

function SignUp() {
  // eslint-disable-next-line
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [successfulSignUp, setSuccessfulSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      const signUpInput = {
        email: e.target.form.inputEmail.value,
        password: e.target.form.inputPassword.value,
        fname: e.target.form.inputFname.value,
        lname: e.target.form.inputLname.value,
      };

      const isValid = await signUpSchema.isValid(signUpInput);
      if (isValid) {
        setEmail(signUpInput.email);
        setPassword(signUpInput.password);
        setFname(signUpInput.fname);
        setLname(signUpInput.lname);
      } else {
        throw new Error();
      }
    } catch (error) {
      setErrorMessage('Please check that your inputs meet the requirements');
    }
  };

  // when state changes, make post req to api auth route
  useEffect(() => {
    const fetchSignUp = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            email, password, fname, lname,
          }),
        });

        const responseJSON = await response.json();
        if (responseJSON.error) {
          throw new Error(responseJSON.error.message);
        } else {
          setErrorMessage('');
          setSuccessMessage('Sign up successful, redirecting to log in');
          setTimeout(() => {
            setSuccessfulSignUp(true);
          }, 2000);
        }
      } catch (error) {
        const message = error.message.includes('Email taken') ? error.message : 'Unable to sign user up';
        setErrorMessage(message);
      }
    };
    if (email && password && fname && lname) fetchSignUp();
  }, [email, password, fname, lname]);

  return (
    <div className="row justify-content-center align-items-center vh-100">
      {user.token ? <Redirect to="/" /> : null}
      {successfulSignUp ? <Redirect to="/login" /> : null}
      <div className="col col-10 col-sm-6">
        <h1 className="text-primary display-5 font-weight-bold">JournalBase</h1>
        {successMessage
          ? (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          ) : null}
        {errorMessage
          ? (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          ) : null}
        <form className="text-left" id="form-signup">
          <div className="row">
            <div className="col">
              <label htmlFor="inputFname" className="sr-only">
                First name
              </label>
              <input type="fisrt-name" id="inputFname" className="form-control" placeholder="First name" required="" name="fname" />
              <small className="form-text text-muted">2 to 45 letters</small>
            </div>
            <div className="col">
              <label htmlFor="inputLname" className="sr-only">
                Last name
              </label>
              <input type="last-name" id="inputLname" className="form-control" placeholder="Last name" required="" name="lname" />
              <small className="form-text text-muted">2 to 45 letters</small>
            </div>
          </div>
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" name="email" />
          <small id="emailHelp" className="form-text text-muted">Up to 45 characters allowed</small>

          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />
          <small id="passwordHelp" className="form-text text-muted">8 to 20 alphanumeric characters</small>

          <button className="btn btn-lg btn-primary btn-block" type="submit" form="form-signup" onClick={handleFormSubmit}>Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
