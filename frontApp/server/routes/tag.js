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
            pages = await hashtag.getPages({
                include : [{
                    model : User,
                    attributes : ['id', 'username','img'],
                }, {
                    model : Hashtag,
                    attributes : ['title'],
                } ],
                order : [['createdAt','DESC']],
                });
            follow = await hashtag.getUsers({where : {id : req.user.id }});
        }
        return res.render('index', {
            title : `${tag} | Anamorph`,
            user : req.user,
            pages : pages, 
            tags : tag,
            follow : follow,
            loginError : req.flash('loginError'),
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/:tag/follow',isLoggedIn ,async (req,res, next) => {
    try {
        const tag = await Hashtag.find({ where : { title : req.params.tag } });
        const user = await User.find({ where : { id : req.user.id } });
        console.log(`user : ${user.username} follow tag : ${tag},`);
        await user.addHashtags(parseInt(tag.id, 10));
        res.send('sucess');
      } catch (error) {
        console.error(error);
        next(error);
      }
});

router.post('/:tag/unfollow', isLoggedIn, async (req, res, next) => {
    try{
        const tag = await Hashtag.find({ where : { title : req.params.tag } });
        const user = await User.find({ where : { id : req.user.id } });
        await user.removeHashtags(parseInt(tag.id, 10));
        res.send('sucess');
    } catch (error) {
        console.error(error);
        next(error);
    }
  });

module.exports = router;