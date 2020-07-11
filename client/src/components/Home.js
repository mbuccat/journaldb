import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../api_url';
import loading from '../assets/loading.gif';
import UserContext from '../UserContext';

function Home() {
  // eslint-disable-next-line
  const { user, setUser } = useContext(UserContext);
  const [journals, setJourals] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const displayJournals = (journalsFromAPI) => {
      // take each journal object and create an LI
      const journalLIs = journalsFromAPI.map((item) => (
        <li className="list-group-item border border-primary font-weight-bold" key={item.JournalID}>
          <Link to={`journals/${item.JournalID}`}>
            {item.Title}
          </Link>
        </li>
      ));

      setJourals(journalLIs);
    };

    const fetchJournals = async () => {
      try {
        const response = await fetch(`${API_URL}/journals`);
        const responseJSON = await response.json();
        if (responseJSON.error) {
          throw new Error();
        } else {
          displayJournals(responseJSON.journals);
        }
      } catch (error) {
        setErrorMessage('Could not get journals');
      }
    };
    fetchJournals();
  }, []);

  return (
    <div>
      {!user.token
        && (
        <div className="jumbotron h-100 bg-white mb-0">
          <h1 className="display-3 font-weight-bold">
            <span role="img" aria-label="wave-globe-emoji">👋🌎</span>
            {' '}
            <br />
            {' '}
            Hello, world!
          </h1>
          <p className="lead">This is a fullstack web app built around my final project for my database class.</p>
          <hr className="my-5" />
          <div className="jumbotron-links d-flex flex-column align-items-center">
            <Link className="btn btn-primary mb-3 w-50" to="/signup" role="button">Sign up for an account</Link>
            <a className="btn btn-outline-dark w-50" href="https://github.com/mbuccat" role="button">View code on GitHub</a>
          </div>
        </div>
        )}
      {errorMessage
        ? (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        ) : null}
      {!journals && !errorMessage
        && (
        <div>
          <p>Fetching journals</p>
          <img src={loading} alt="loading gif" />
        </div>
        )}
      {journals
        && (
          <div className="row mt-4 justify-content-center">
            <div className="col-12">
              <h2>Journals:</h2>
            </div>
            <div className="col-12 col-md-6 text-left">
              <ul className="list-group mx-2 mb-3">
                {journals}
              </ul>
            </div>
          </div>
        )}
    </div>
  );
}

export default Home;
