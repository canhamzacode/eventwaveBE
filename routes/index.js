const express = require('express');
const router = express.Router();
const welcome = require('./welcome.route');
const auth = require('./auth.route');

router.use('/', welcome);
router.use('/', auth);

module.exports = router;
