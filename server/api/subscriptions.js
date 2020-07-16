const { Router } = require('express');
const pool = require('../dbConnection');
const {
  validatePathParams, checkJournalExists, checkUserExists, checkSubscriptionExists,
} = require('./middlewares');

const router = Router();

// get a user's subscriptions
router.get('/', checkUserExists, (req, res, next) => {
  const userId = req.user.SubscriberID;

  pool.query(
    `SELECT * FROM ${process.env.DB_SCHEMA}.get_subscriptions(${userId});`,
    (error, results) => {
      if (error) next(new Error('Unable to get your subscriptions'));
      else {
        res.status(200).json({
          subscriptions: results.rows,
        });
      }
    },
  );
});

// add a new subscription
router.post('/:journalId', validatePathParams, checkJournalExists, (req, res, next) => {
  const userId = req.user.SubscriberID;
  const { journalId } = req.params;
  const today = (new Date()).toISOString().split('T')[0];

  pool.query(
    `SELECT ${process.env.DB_SCHEMA}.add_subscription(${userId}::INT, ${journalId}::INT, '${today}'::DATE, '${today}'::DATE);`,
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
router.delete('/:journalId', validatePathParams, checkSubscriptionExists, (req, res, next) => {
  const userId = req.user.SubscriberID;
  const { journalId } = req.params;

  pool.query(
    `SELECT ${process.env.DB_SCHEMA}.delete_subscription(${journalId}::INT, ${userId}::INT);`,
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
router.put('/:journalId', validatePathParams, checkSubscriptionExists, (req, res, next) => {
  const userId = req.user.SubscriberID;
  const { journalId } = req.params;
  const currentExpiration = new Date(req.subscriptionInfo.Expires);
  const newExpiration = currentExpiration.getTime() + 2629800000; // adds one month
  const expires = (new Date(newExpiration)).toISOString().split('T')[0];

  pool.query(
    `SELECT ${process.env.DB_SCHEMA}.renew_subscription(${userId}::INT, ${journalId}::INT, '${expires}'::DATE);`,
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
