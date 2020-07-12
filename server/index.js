// require dependencies
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const middlewares = require('./middlewares');

// require routers
const auth = require('./auth/index');
const journals = require('./api/journals');
const subscriptions = require('./api/subscriptions');

// create an app
const app = express();
// declare a port
const PORT = process.env.PORT || 8000;

// rate limiter settings
app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});

// add middlewares
app.use(limiter);
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(middlewares.validateToken);

// add slash path
app.get('/', (req, res) => {
  res.status(200).json({
    message: '👋 🌍',
  });
});

// additional routers
app.use('/auth', auth);
app.use('/journals', journals);
app.use('/subscriptions', middlewares.checkIsLoggedIn, subscriptions);

// page not found
app.use((req, res, next) => {
  const error = new Error('Page not found');
  error.status = 404;
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
  console.log('Error handler:', err.message);
});

// make app listen at port
app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
