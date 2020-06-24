const { Router } = require('express');
const pool = require('../dbConnection');
const {
  validatePathParams, checkJournalExists, checkUserExists, checkSubscriptionExists,
} = require('./middlewares');

const router = Router();

// get a user's subscriptions
router.get('/:userId', validatePathParams, checkUserExists, (req, res, next) => {
  const { userId } = req.params;

  pool.query(
    `SELECT subscriptions.JournalID, Expires, SubscribedSince, Title, PaymentRate 
    FROM subscriptions 
    JOIN journals ON subscriptions.JournalID=journals.JournalID 
    WHERE subscriptions.SubscriberID=${userId}`,
    (error, results) => {
      if (error) next(new Error('Unable to get your subscriptions'));
      else {
        res.status(200).json({
          subscriptions: results,
        });
      }
    },
  );
});

// add a new subscription
router.post('/:userId/:journalId', validatePathParams, checkJournalExists, (req, res, next) => {
  const { userId, journalId } = req.params;
  const today = (new Date()).toISOString().split('T')[0];

  pool.query(
    `INSERT INTO subscriptions (SubscriberID, JournalID, SubscribedSince, Expires)
    VALUES (${userId}, ${journalId}, '${today}', '${today}')`,
    (error) => {
      if (error) next(new Error('Unable to add subscription'));
      else {
        res.status(200).json({
          message: `Subscribed user ${userId} to journal ${journalId}`,
        });
      }
    },
  );
});

// delete a subscription
router.delete('/:userId/:journalId', validatePathParams, checkSubscriptionExists, (req, res, next) => {
  const { userId, journalId } = req.params;

  pool.query(
    `DELETE FROM subscriptions WHERE SubscriberID=${userId} AND JournalID=${journalId};`,
    (error) => {
      if (error) next(new Error('Unable to delete subscription'));
      else {
        res.status(200).json({
          message: `Deleted user ${userId}'s subscription to journal ${journalId}`,
        });
      }
    },
  );
});

// renew a subscription
router.put('/:userId/:journalId', validatePathParams, checkSubscriptionExists, (req, res, next) => {
  const { userId, journalId } = req.params;
  const expiresMillis = Date.now() + 2629800000;
  const expires = (new Date(expiresMillis)).toISOString().split('T')[0];

  pool.query(
    `UPDATE subscriptions SET Expires='${expires}' WHERE SubscriberID=${userId} AND JournalID=${journalId};`,
    (error) => {
      if (error) next(new Error('Unable to renew subscription'));
      else {
        res.status(200).json({
          message: `Added 1 month to user ${userId}'s subscription for journal ${journalId}`,
        });
      }
    },
  );
});

module.exports = router;
