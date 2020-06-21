const { Router } = require('express');

// make a new router object
const router = Router();

// get a user's subscriptions
router.get('/:userId', (req, res) => {
  res.status(200).json({
    message: `These are user ${req.params.userId}'s subscriptions`,
  });
});

// add a new subscription
router.post('/:userId/:journalId', (req, res) => {
  res.status(201).json({
    message: `Journal ${req.params.journalId} has been added to user ${req.params.userId}'s subscriptions`,
  });
});

// delete a subscription
router.delete('/:userId/:journalId', (req, res) => {
  res.status(200).json({
    message: `Journal ${req.params.journalId} has been deleted from user ${req.params.userId}'s subscriptions`,
  });
});

// renew a subscription
router.put('/:userId/:journalId', (req, res) => {
  res.status(200).json({
    message: `User ${req.params.userId} has renewed their subscription for journal ${req.params.journalId}`,
  });
});

module.exports = router;
