const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: 'String',
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
