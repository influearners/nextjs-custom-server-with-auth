const express = require('express');
const AppError = require('../utils/AppError');
const User = require('../models/UserModel');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to API',
  });
});

router.post('/login', async (req, res, next) => {
  if (req.session.user) {
    return res.status(200).json({
      status: 'success',
      message: 'Already Signed in!',
      user: { _id: req.session.user._id, username: req.session.user.username },
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new AppError('Username and Password are required', 'fail', 400)
    );
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError('User does not exist!', 'fail', 404));
    }

    if (user.password !== password) {
      return next(new AppError('Incorrect Password!', 'fail', 400));
    }

    req.session.user = { _id: user._id, username: user.username };

    return res.status(200).json({
      status: 'success',
      message: 'Signin Sucessful!',
      user: { _id: user._id, username: user.username },
    });
  } catch (error) {
    return next(new AppError('Login Failed!', 'error', 500));
  }
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new AppError('Username and Password are required', 'fail', 400)
    );
  }

  try {
    const user = new User({ username, password });
    await user.save();

    req.session.user = { _id: user._id, username: user.username };

    return res.status(201).json({
      status: 'success',
      message: 'Signup Sucessful!',
      user: { _id: user._id, username: user.username },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError('Signup Failed!', 'error', 500));
  }
});

router.post('/logout', async (req, res, next) => {
  req.session.user = null;
  res.status(200).json({
    status: 'success',
    message: 'Logged out Successfully!',
  });
});

router.get('/me', async (req, res, next) => {
  if (!req.session.user) {
    return next(new AppError('Please Login First!', 'fail', 401));
  }

  res.status(200).json({
    status: 'success',
    message: 'Successfully Got Your Proile!',
    user: { _id: req.session.user._id, username: req.session.user.username },
  });
});

module.exports = router;
