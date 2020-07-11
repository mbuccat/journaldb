import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { pathParam } from '../schema';
import API_URL from '../api_url';

function Article({ match: { params: { journalID, articleID } } }) {
  const [journal, setJournal] = useState();
  const [article, setArticle] = useState();
  const [title, setTitle] = useState();
  const [volume, setVolume] = useState();
  const [issue, setIssue] = useState();
  const [datePublished, setDatePublished] = useState();
  const [content, setContent] = useState();
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // validate path params and save them in state
    const validatePathParams = async () => {
      try {
        const isValidJournal = await pathParam.isValid(journalID);
        const isValidArticle = await pathParam.isValid(articleID);
        if (isValidJournal && isValidArticle) {
          setJournal(journalID);
          setArticle(articleID);
        } else {
          throw new Error();
        }
      } catch (error) {
        setRedirect(true);
      }
    };

    validatePathParams();
  }, [articleID, journalID]);

  // only fetch if user is logged in
  useEffect(() => {
    const displayArticle = (articleFromAPI) => {
      const { article: articleData } = articleFromAPI;
      setTitle(articleData.Title);
      setVolume(articleData.Volume);
      setIssue(articleData.Issue);
      setDatePublished(articleData.DatePublished);
      setContent(articleData.Content);
      setErrorMessage('');
    };

    const fetchArticleInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/journals/${journal}/${article}`, {
          headers: {
            authorization: `Bearer ${localStorage.token}`,
          },
        });
        const responseJSON = await response.json();

        if (responseJSON.error) {
          throw new Error();
        } else {
          displayArticle(responseJSON);
        }
      } catch (error) {
        setErrorMessage('Could not get article');
      }
    };

    if (journal && article && localStorage.token) fetchArticleInfo();
    else {
      setErrorMessage('You must be logged in to view articles');
    }
  }, [journal, article]);

  return (
    <div className="row mt-3 justify-content-center">
      {redirect ? <Redirect to="/notfound" /> : null}
      <div className="col-12 col-sm-8 text-left px-5">
        {errorMessage
          ? (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          ) : null}
        {title && <h1 className="font-weight-bold">{title}</h1>}
        <div className="mb-4">
          {volume && (
          <div>
            {`Volume: ${volume}`}
          </div>
          )}
          {issue && (
          <div>
            {`Issue: ${issue}`}
          </div>
          )}
          {datePublished && (
          <div>
            {`Published: ${datePublished.slice(0, 10)}`}
          </div>
          )}
        </div>
        {content && <p>{content}</p>}
      </div>
    </div>
  );
}

Article.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      journalID: PropTypes.string,
      articleID: PropTypes.string,
    }),
  }).isRequired,
};

export default Article;
