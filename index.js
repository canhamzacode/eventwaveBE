require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');
const router = require('./routes/index');
const passport = require('./config/passport');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const cors = require('cors');

const app = express();
app.use(cors());

// middlewares
app.use(express.json());
app.use(passport.initialize());

// routes
app.use('/api/v1/', router);

// not found middle ware
app.use(notFoundMiddleware); 
// error handler middle ware
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;

const server = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

server();
