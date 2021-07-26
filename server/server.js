const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'server.env') });
const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routes/api.routes.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const AppError = require('./utils/AppError');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Connect to DB
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (error) => {
    if (error) {
      console.log('Initial Connection Error!');
      console.log(error);
    }
  }
);
mongoose.connection.on('error', (error) => {
  console.log('After Connection Error!');
  console.log(error);
});

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.set('trust proxy', 1); // trust first proxy
  const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_MAX_AGE_DAYS) * 24 * 60 * 60 * 1000,
      sameSite: true,
    },
  };
  if (process.env.NODE_ENV === 'production') {
    sessionOptions.cookie.domain = process.env.COOKIE_DOMAIN;
    sessionOptions.cookie.secure = Boolean(process.env.SECURE_COOKIE);
  }
  server.use(session(sessionOptions));

  // Neccessary Middlewares
  server.use(cookieParser());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // API Routes Handler
  server.use('/api', apiRouter);
  // Pass Not Found Error To Express Error Handler
  server.use('/api', (req, res, next) => {
    next(new AppError(`${req.originalUrl} does not exist!`, 'fail', 404));
  });

  // NextJS Pages Routes Handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Express Error Handler
  server.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Something Went Wrong!';
    console.log(err);
    return res.status(statusCode).json({
      status,
      message,
    });
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to DB!');
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
});
