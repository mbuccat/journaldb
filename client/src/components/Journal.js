import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { pathParam } from '../schema';
import API_URL from '../api_url';
import UserContext from '../UserContext';

function Journal({ match: { params: { journalID } } }) {
  // eslint-disable-next-line
  const { user, setUser } = useContext(UserContext);
  const [journal, setJournal] = useState(); // journalID is already taken as a name
  const [title, setTitle] = useState();
  const [dateFounded, setDateFounded] = useState();
  const [payment, setPayment] = useState();
  const [articles, setArticles] = useState();
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const validateJournalID = async () => {
      try {
        const isValid = await pathParam.isValid(journalID);
        if (isValid) setJournal(journalID);
        else throw new Error();
      } catch (error) {
        setRedirect(true);
      }
    };

    validateJournalID();
  }, [journalID]);

  // validate journalID and save it in state

  // with a valid journal ID, fetch from API
  useEffect(() => {
    const displayArticles = (articlesFromAPI) => {
      // take each article object and create an LI
      const articleLIs = articlesFromAPI.map((item) => (
        <Link to={`/journals/${journalID}/${item.ArticleID}`}>
          <li key={item.ArticleID}>
            {item.Title}
          </li>
        </Link>
      ));
      setArticles(articleLIs);
    };

    const displayJournalInfo = (journalInfo) => {
      setTitle(journalInfo.JournalTitle);
      setDateFounded(journalInfo.DateFounded);
      setPayment(journalInfo.PaymentRate);

      displayArticles(journalInfo.articles);
    };

    const fetchJournalInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/journals/${journal}`);
        const responseJSON = await response.json();
        if (responseJSON.error) {
          throw new Error();
        } else {
          displayJournalInfo(responseJSON);
        }
      } catch (error) {
        setErrorMessage('Could not fetch journal');
      }
    };

    if (journal) fetchJournalInfo();
  }, [journal, journalID]);

  const handleSubscribe = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(`${API_URL}/subscriptions/${journal}`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      });
      const responseJSON = await response.json();
      if (responseJSON.error) {
        throw new Error();
      } else {
        setSuccessMessage('Subscription added');
      }
    } catch (error) {
      setErrorMessage('Could not add subscription');
    }
  };

  return (
    <div>
      {redirect ? <Redirect to="/notfound" /> : null}
      {errorMessage
        ? (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        ) : null}
      {successMessage
        ? (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        ) : null}
      {title && <h1>{title}</h1>}
      {dateFounded && payment && (
      <p>
        {dateFounded}
        {' '}
        <br />
        {' '}
        {payment}
      </p>
      )}
      {user.token && !errorMessage && <button type="button" onClick={handleSubscribe}>Subscribe</button>}
      {articles && (
      <ul>
        These are the articles:
        {articles}
      </ul>
      )}
    </div>
  );
}

Journal.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      journalID: PropTypes.number,
    }),
  }).isRequired,
};

export default Journal;
