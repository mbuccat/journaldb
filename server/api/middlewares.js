const Joi = require('@hapi/joi');
const pool = require('../dbConnection');

const number = Joi.number();

const validatePathParams = (req, res, next) => {
  const { journalId, articleId } = req.params;
  const { error: validationErrorJournal } = number.validate(journalId);
  const { error: validationErrorArticle } = number.validate(articleId);

  if (validationErrorJournal || validationErrorArticle) {
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
  } else {
    next();
  }
};

const checkJournalExists = (req, res, next) => {
  const { journalId } = req.params;

  pool.query(
    `SELECT * FROM ${process.env.DB_SCHEMA}.check_journal_exists(${journalId})`,
    (journalError, results) => {
      if (journalError) next(new Error('Error encountered when looking for journal'));
      else if (results.rows.length === 0) {
        const error = new Error('Journal does not exist');
        error.status = 404;
        next(error);
      } else {
        next();
      }
    },
  );
};

const checkUserExists = (req, res, next) => {
  const userId = req.user.SubscriberID;

  pool.query(
    `SELECT * FROM ${process.env.DB_SCHEMA}.check_user_exists(${userId})`,
    (subscriberError, results) => {
      if (subscriberError) next(new Error('Error encountered when looking for user'));
      else if (results.rows.length === 0) {
        const error = new Error('User does not exist');
        error.status = 404;
        next(error);
      } else {
        next();
      }
    },
  );
};

const checkSubscriptionExists = (req, res, next) => {
  const userId = req.user.SubscriberID;
  const { journalId } = req.params;

  pool.query(
    `SELECT * FROM ${process.env.DB_SCHEMA}.check_subscription_exists(${journalId}, ${userId})`,
    (subscriptionError, results) => {
      if (subscriptionError) next(new Error('Error encountered when looking for subscription'));
      else if (results.rows.length === 0) {
        const error = new Error('Subscription does not exist');
        error.status = 404;
        next(error);
      } else {
        // add subscription info to req object
        req.subscriptionInfo = results.rows[0];
        next();
      }
    },
  );
};

module.exports = {
  validatePathParams, checkJournalExists, checkUserExists, checkSubscriptionExists,
};
