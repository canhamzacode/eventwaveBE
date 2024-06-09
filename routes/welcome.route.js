const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the eventWave API. Kindly checkout the documentation here'
  });
});

module.exports = router;
