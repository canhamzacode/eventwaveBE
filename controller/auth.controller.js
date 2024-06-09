const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const sendEmail = require('../utils/sendEmail');

const loginController = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: info ? info.message : 'Login failed', user });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        interest: user.interest,
        isVerified: user.isVerified,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return res.json({ user: userResponse, token });
    });
  })(req, res, next);
};

const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        message: 'User already exists'
      });
    }

    const name = email.split('@')[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, name });

    // Generate verification token
    const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d'
    });
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    await sendEmail(
      email,
      'Verify your email',
      `<p>Please verify your email by clicking this link: <a href="${verificationUrl}">Here</a></p>`
    );

    if (!newUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'User could not be created'
      });
    }

    const signupResponse = {
      name: newUser.name,
      email: newUser.email
    };

    return res.status(StatusCodes.CREATED).json({
      message: 'User Created successfully',
      data: signupResponse
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong'
    });
  }
};

const verifyEmailController = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid user' });
    }

    if (user.isVerified) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already verified' });
    }

    user.isVerified = true;
    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Email verified successfully. You can now login.' });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: err.message
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '10m'
    });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      'Reset your password',
      `<p>Please reset your password by clicking this link: <a href="${resetUrl}">Here</a></p>`
    );

    return res.status(StatusCodes.OK).json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: err.message
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const user = req.user;

    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(StatusCodes.OK).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error: err.message
    });
  }
};

const verifyTokenController = async (req, res) => {
  const user = req.user;
  return res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  loginController,
  signupController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  verifyTokenController
};
