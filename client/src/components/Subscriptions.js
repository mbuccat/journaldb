import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import API_URL from '../api_url';
import loading from '../assets/loading.gif';

function Subscriptions() {
  // eslint-disable-next-line
  const { user, setUser } = useContext(UserContext);
  const [subscriptions, setSubscriptions] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRenew = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(`${API_URL}/subscriptions/${e.target.dataset.journal}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      });
      const responseJSON = await response.json();
      if (responseJSON.error) {
        throw new Error();
      } else {
        setErrorMessage('');
        setSuccessMessage('Renewed subscription');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      setErrorMessage('Unable to renew subscription');
    }
  };

  const handleCancel = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(`${API_URL}/subscriptions/${e.target.dataset.journal}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      });
      const responseJSON = await response.json();
      if (responseJSON.error) {
        throw new Error();
      } else {
        setErrorMessage('');
        setSuccessMessage('Canceled subscription');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      setErrorMessage('Unable to cancel subscription');
    }
  };

  // fetch subscriptions with user token
  useEffect(() => {
    const displaySubscriptions = (subscriptionsFromAPI) => {
      // take each subscription object and create an LI
      const subscriptionsLIs = subscriptionsFromAPI.map((item) => (
        <li key={item.JournalID}>
          <div>
            <Link to={`/journals/${item.JournalID}`}>
              {item.Title}
            </Link>
            {item.SubscribedSince}
            {item.Expires}
            {item.PaymentRate}
          </div>
          <div>
            <button type="button" data-journal={item.JournalID} onClick={handleRenew}>Renew</button>
            <button type="button" data-journal={item.JournalID} onClick={handleCancel}>Cancel</button>
          </div>
        </li>
      ));
      setSubscriptions(subscriptionsLIs);
    };

    const fetchSubcriptions = async () => {
      try {
        const response = await fetch(`${API_URL}/subscriptions`, {
          headers: {
            authorization: `Bearer ${localStorage.token}`,
          },
        });
        const responseJSON = await response.json();
        if (responseJSON.error) {
          throw new Error();
        } else {
          displaySubscriptions(responseJSON.subscriptions);
        }
      } catch (error) {
        setErrorMessage('Unable to fetch subscriptions');
      }
    };

    if (user.token) fetchSubcriptions();
    else setErrorMessage('You must be logged in to view your subscriptions');
  }, [user]);

  return (
    <div>
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
      {!subscriptions && !errorMessage
        && (
        <div>
          <p>Fetching journals</p>
          <img src={loading} alt="loading gif" />
        </div>
        )}
      {subscriptions
        && (
        <ul>
          <h1>Your subscriptions:</h1>
          {subscriptions}
        </ul>
        )}
    </div>
  );
}

export default Subscriptions;
