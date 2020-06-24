const Joi = require('@hapi/joi');
const pool = require('../dbConnection');

const number = Joi.number();

const validatePathParams = (req, res, next) => {
  const { userId, journalId, articleId } = req.params;
  const { error: validationErrorUser } = number.validate(userId);
  const { error: validationErrorJournal } = number.validate(journalId);
  const { error: validationErrorArticle } = number.validate(articleId);

  if (validationErrorUser || validationErrorJournal || validationErrorArticle) {
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
    `SELECT Title FROM journals WHERE JournalID=${journalId}`,
    (journalError, results) => {
      if (journalError) next(new Error('Error encountered when looking for journal'));
      else if (results.length === 0) {
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
  const { userId } = req.params;

  pool.query(
    `SELECT * from subscribers WHERE SubscriberID=${userId}`,
    (subscriberError, results) => {
      if (subscriberError) next(new Error('Error encountered when looking for user'));
      else if (results.length === 0) {
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
  const { userId, journalId } = req.params;

  pool.query(
    `SELECT * from subscriptions WHERE SubscriberID=${userId} AND JournalID=${journalId}`,
    (subscriptionError, results) => {
      if (subscriptionError) next(new Error('Error encountered when looking for subscription'));
      else if (results.length === 0) {
        const error = new Error('Subscription does not exist');
        error.status = 404;
        next(error);
      } else {
        next();
      }
    },
  );
};

module.exports = {
  validatePathParams, checkJournalExists, checkUserExists, checkSubscriptionExists,
};
