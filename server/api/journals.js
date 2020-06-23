const { Router } = require('express');
const Joi = require('@hapi/joi');
const pool = require('../dbConnection');

const router = Router();

const number = Joi.number();

// path for getting all the journals
router.get('/', (req, res, next) => {
  pool.query('SELECT JournalID, Title FROM journals', (error, results) => {
    if (error) next(new Error('Unable to get journals'));
    else {
      const journals = results;

      res.status(200).json({
        journals,
      });
    }
  });
});

// path for getting a specific journal's page
router.get('/:journalId', (req, res, next) => {
  // validate parameters before making database query
  const { journalId } = req.params;
  const { error: validationError } = number.validate(journalId);

  if (validationError) {
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
  } else {
    pool.getConnection((error, connection) => {
      let journalInfo;
      let articles;

      if (error) next(new Error('Unable to get journal page'));
      else {
        // get the journal's info
        connection.query(
          `SELECT * FROM journals WHERE JournalID=${journalId}`,
          (journalError, results) => {
            [journalInfo] = results;
            if (journalError) next(new Error('Unable to get journal page'));
          },
        );

        // get the articles in that journal
        connection.query(
          `SELECT ArticleID, Title FROM articles WHERE JournalID=${journalId}`,
          (articleError, results) => {
            articles = results;
            connection.release();

            res.status(200).json({
              journalInfo,
              articles,
            });

            if (articleError) next(new Error('Unable to get journal page'));
          },
        );
      }
    });
  }
});

// path for getting a specific article in a specific journal
router.get('/:journalId/:articleId', (req, res, next) => {
  // validate parameters before making database query
  const { journalId } = req.params;
  const { articleId } = req.params;
  const { error: validationErrorJournal } = number.validate(journalId);
  const { error: validationErrorArticle } = number.validate(articleId);

  if (validationErrorJournal || validationErrorArticle) {
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
  } else {
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
  }
});

module.exports = router;
