const { Router } = require('express');
const pool = require('../dbConnection');
const { validatePathParams, checkJournalExists } = require('./middlewares');

const router = Router();

// path for getting all the journals
router.get('/', (req, res, next) => {
  pool.query(
    'SELECT JournalID, Title FROM journals',
    (error, results) => {
      if (error) next(new Error('Unable to get journals'));
      else {
        const journals = results;

        res.status(200).json({
          journals,
        });
      }
    },
  );
});

const getJournalInfo = (req, res, next) => {
  const { journalId } = req.params;

  pool.query(
    `SELECT * FROM journals WHERE JournalID=${journalId};`,
    (error, results) => {
      if (error) next(new Error('Unable to get journal page'));
      else {
        const { Title, DateFounded, PaymentRate } = results[0];
        req.locals = {
          JournalTitle: Title,
          DateFounded,
          PaymentRate,
        };
        next();
      }
    },
  );
};

// path for getting a specific journal's page
router.get('/:journalId', validatePathParams, checkJournalExists, getJournalInfo, (req, res, next) => {
  const { journalId } = req.params;

  pool.query(
    `SELECT ArticleID, articles.Title FROM articles WHERE JournalID=${journalId};`,
    (error, results) => {
      if (error) next(new Error('Unable to get articles'));
      else {
        const { JournalTitle, DateFounded, PaymentRate } = req.locals;
        res.status(200).json({
          JournalTitle,
          DateFounded,
          PaymentRate,
          articles: results,
        });
      }
    },
  );
});

// path for getting a specific article in a specific journal
router.get('/:journalId/:articleId', validatePathParams, (req, res, next) => {
  const { journalId, articleId } = req.params;

  pool.query(
    `SELECT * FROM articles WHERE ArticleID=${articleId} AND JournalID=${journalId}`,
    (articleError, results) => {
      if (articleError) next(new Error('Unable to get article page'));

      if (results.length === 0) {
        const error = new Error('Page not found');
        error.status = 404;
        next(error);
      } else {
        res.status(200).json({
          article: results[0],
        });
      }
    },
  );
});

module.exports = router;
