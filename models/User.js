const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      }
    },
    interest: {
      type: [String]
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    location: {
      type: String
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
