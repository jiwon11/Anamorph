var express = require('express');
// get gravatar icon from email
var gravatar = require('gravatar');
const{ isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Page,Hashtag,User,Comment,Like } = require('../../models');


var router = express.Router();

router.get('/',isLoggedIn, async(req,res,next) => {
    const user = await User.find({ where : { id : req.user.id } });
    let followers = [];
    let followings = [];
    let followTag = [];
    if (user) {
    followTag = await user.getHashtags({ include : [{ model : Page, include: [User,Hashtag,Comment,Like] }] });
    for(var i=0;i < req.user.Followers.length;i++) {
        followers = await User.findAll({ where : {id : req.user.Followers[i].id } });
        }
    for(var j=0;j < req.user.Followings.length;j++) {
        followings = await User.findAll({ where : {id : req.user.Followings[j].id } });
        }
    }
    res.render('follow', {
        title:`follow | Anamorph`,
        user : req.user,
        followTag : followTag,
        followers : followers,
        followings : followings,
        loginError : req.flash('loginError'),
    });
});




module.exports = router;