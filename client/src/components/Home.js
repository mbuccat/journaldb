import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../api_url';
import loading from '../assets/loading.gif';

function Home() {
  const [journals, setJourals] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const displayJournals = (journalsFromAPI) => {
      // take each journal object and create an LI
      const journalLIs = journalsFromAPI.map((item) => (
        <Link to={`journals/${item.JournalID}`}>
          <li key={item.JournalID}>
            {item.Title}
          </li>
        </Link>
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
        <ul>
          Journal list:
          {journals}
        </ul>
        )}
    </div>

  );
}

export default Home;
