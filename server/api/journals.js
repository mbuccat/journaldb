const { Router } = require('express');
const pool = require('../dbConnection');
const { validatePathParams, checkJournalExists } = require('./middlewares');
const { checkIsLoggedIn } = require('../middlewares');

const router = Router();

// path for getting all the journals
router.get('/', (req, res, next) => {
  pool.query(
    `SELECT * FROM ${process.env.DB_SCHEMA}.get_journals();`,
    (error, results) => {
      if (error) next(new Error('Unable to get journals'));
      else {
        const journals = results.rows;

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
    `SELECT * FROM ${process.env.DB_SCHEMA}.get_journal_info(${journalId});`,
    (error, results) => {
      if (error) next(new Error('Unable to get journal page'));
      else {
        const { Title, DateFounded, PaymentRate } = results.rows[0];
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
    `SELECT * FROM ${process.env.DB_SCHEMA}.get_journal_articles(${journalId});`,
    (error, results) => {
      if (error) next(new Error('Unable to get articles'));
      else {
        const { JournalTitle, DateFounded, PaymentRate } = req.locals;
        res.status(200).json({
          JournalTitle,
          DateFounded,
          PaymentRate,
          articles: results.rows,
        });
      }
    },
  );
});

// path for getting a specific article in a specific journal
router.get('/:journalId/:articleId', checkIsLoggedIn, validatePathParams, (req, res, next) => {
  const { journalId, articleId } = req.params;

  pool.query(
    `SELECT * FROM ${process.env.DB_SCHEMA}.get_article_info(${journalId}, ${articleId});`,
    (articleError, results) => {
      if (articleError) next(new Error('Unable to get article page'));
      else if (results.rows.length === 0) {
        const error = new Error('Page not found');
        error.status = 404;
        next(error);
      } else {
        res.status(200).json({
          article: results.rows,
        });
      }
    },
  );
});

module.exports = router;
