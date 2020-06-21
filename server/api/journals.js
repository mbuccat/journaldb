const { Router } = require('express');

// make a new router object
const router = Router();

// path for getting all the journals
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'This will display all the journals 📚',
  });
});

// path for getting a specific journal's page
router.get('/:journalId', (req, res) => {
  res.status(200).json({
    message: `This is the page for journal ${req.params.journalId}`,
  });
});

// path for getting a specific article in a specific journal
router.get('/:journalId/:articleId', (req, res) => {
  res.status(200).json({
    message: `This is the page for article ${req.params.articleId} in journal ${req.params.journalId}`,
  });
});

module.exports = router;
