var express = require('express');
const{ isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User,Page,Hashtag,Comment } = require('../../models');

var router = express.Router();


router.post('/post', isLoggedIn, async (req, res, next) => {
    console.log(req.body);
    Comment.create({
        commenter: req.body.userId,
        comment: req.body.comment,
        commentpage : req.body.pageId,
      })
        .then((result) => {
          console.log(result);
          res.status(201).json(result);
        })
        .catch((err) => {
          console.error(err);
          next(err);
        });
});

router.get('/:pageId', function(req, res, next) {
    Comment.findAll({
      include: {
        model: User,
        attributes : ['id', 'username','img'],
      },
      where : { commentpage : req.params.pageId },
    })
      .then((comments) => {
        console.log(comments);
        res.json(comments);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  });
module.exports = router;