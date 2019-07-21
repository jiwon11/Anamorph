const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Page,Hashtag,User,Comment,Like } = require('../../models');
const gravatar = require('gravatar');

const router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn ,(req, res, next) => {
  Page.findAll({
      include : [{
          model : User,
          attributes : ['id', 'username','img'],
      }, {
          model : Hashtag,
          attributes : ['title'],
      }, {
          model : Comment,
      },{
          model : Like,
      },],
      order : [['createdAt','DESC']],
  })
  .then (async (pages) => {
          const tags = await Hashtag.findAll({ });
          res.render('index', {
              title : 'Viewport',
              pages : pages,
              user : req.user,
              gravatar: gravatar.url(req.user.email,{s:'80',r:'x',d:'retro'},true),
              tags : tags,
              loginError : req.flash('loginError'),
          });
  })
  .catch((error) => {
      console.error(error);
      next(error);
  });
});


module.exports = router;