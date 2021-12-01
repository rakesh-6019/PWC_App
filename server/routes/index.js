var express = require('express');
var router = express.Router();
const axios = require('axios');

const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', userController.getAllUsers);


module.exports = router;
