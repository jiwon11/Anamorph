var express = require('express');
const{ isLoggedIn, isNotLoggedIn } = require('./middlewares');

var router = express.Router();

/* GET users listing. */
router.get('/',isNotLoggedIn, async(req,res,next) => {
  res.render('signup1', { 
    title: 'Sign Up - Anamorph',
    user : req.user,
    joinError : req.flash('joinError'),
  });
});

module.exports = router;