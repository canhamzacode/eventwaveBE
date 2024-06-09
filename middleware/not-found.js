const { StatusCodes } = require('http-status-codes');
const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route Does Not Exist' });
};

module.exports = notFound;
