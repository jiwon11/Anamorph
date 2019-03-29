const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title : 'Anamorph',
    pages : [],
    user : req.user,
    loginError : req.flash('loginError'),
  });
});

module.exports = router;