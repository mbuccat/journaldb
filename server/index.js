// require dependencies
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

// create an app
const app = express();
// declare a port
const PORT = process.env.PORT || 8000;

// add middlewares
app.use(morgan('common'));
app.use(helmet());
app.use(express.json());

// add slash path
app.get('/', (req, res) => {
  res.status(200).json({
    message: '👋 🌍',
  });
});

// make app listen at port
app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
