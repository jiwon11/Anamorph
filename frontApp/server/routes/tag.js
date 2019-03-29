const express = require('express');
const router = express.Router();

const { Page,Hashtag,User } = require('../../models');
const { isLoggedIn } = require('./middlewares');
/* GET home page. */
router.get('/:tag', async (req, res, next) => {
    const tag = req.params.tag;
    if(!tag) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.find({ where : { title : tag } });
        let pages = [];
        if (hashtag) {
            pages = await hashtag.getPages({ include : [{ model : User }] });
        }
        return res.render('index', {
            title : `${tag} | Anamorph`,
            user : req.user,
            pages : pages, 
            tags : tag,
            loginError : req.flash('loginError'),
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;