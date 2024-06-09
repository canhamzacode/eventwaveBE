const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const verifyToken = async (req, res, next) => {
  const token = req.query.token;

  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or missing token' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or missing token' });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: err.message
    });
  }
};

module.exports = verifyToken;
