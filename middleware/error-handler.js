const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (res) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something Went Wrong!!!' });
};

module.exports = errorHandlerMiddleware;
