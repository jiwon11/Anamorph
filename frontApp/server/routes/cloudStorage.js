const express = require('express');
const gravatar = require('gravatar');

const { Page,Hashtag,User,Comment,Like } = require('../../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/',isLoggedIn, async(req, res, next) => {
    return res.render('cloudStorage', {
        title : `${req.user.username}'s cloud Storage | Anamorph`,
        user : req.user,
        gravatar: gravatar.url(req.user.email,{s:'80',r:'x',d:'retro'},true),
    });
});
router.post('/postReflex', async(req, res, next) => {
    modelTitle = req.body.modelTitle;
    console.log(modelTitle);
});

module.exports = router;