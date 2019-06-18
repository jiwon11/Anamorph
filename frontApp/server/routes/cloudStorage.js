const express = require('express');
const gravatar = require('gravatar');

const { Page,Hashtag,User,Comment,Like } = require('../../models');

const router = express.Router();

router.get('/', async(req, res, next) => {
    return res.render('cloudStorage', {
        title : `${req.user.username}'s cloud Storage | Anamorph`,
        user : req.user,
        gravatar: gravatar.url(req.user.email,{s:'80',r:'x',d:'retro'},true),
    });
});

module.exports = router;