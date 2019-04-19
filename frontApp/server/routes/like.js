const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');

const { Page,Hashtag,User,Like } = require('../../models');
const { isLoggedIn } = require('./middlewares');

router.post('/', isLoggedIn, async(req, res, next) => {
    var userId = req.body.userId;
    var pageId = req.body.pageId;
    console.log(`user[${userId}] likes page[${pageId}]`);
    await Like.findOrCreate({
        where : {
            userLike: userId,
            likepage : pageId
            },
        defaults: { 
            likeCount: sequelize.literal('likeCount + 1'),
            userLike : userId, 
            likepage : pageId 
        },
    }).spread(function (like,created) {
        if (created) {
            res.json(like);
        } else {
            res.json(like);
        }
    });
});

router.delete('/', isLoggedIn, async(req, res, next) => {
    var userId = req.body.userId;
    var pageId = req.body.pageId;
    console.log(`user[${userId}] likes page[${pageId}]`);
    
    await Like.destroy({ where: {
        userLike: userId,
        likepage : pageId
        } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
module.exports = router;