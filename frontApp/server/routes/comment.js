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
        res.json(comments);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  });

router.patch('/:commentId', function(req, res, next) {
  Comment.update({ comment: req.body.comment }, { where: { id: req.params.commentId } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.delete('/:id', function(req, res, next) {
  Comment.destroy({ where: { id: req.params.id } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
module.exports = router;