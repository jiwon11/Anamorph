var express = require('express');
// get gravatar icon from email
var gravatar = require('gravatar');
const{ isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User,Page,Hashtag } = require('../../models');


var router = express.Router();

router.get('/',isLoggedIn, async(req,res,next) => {
    console.log(req.user);
    const user = await User.find({ where : { id : req.user.id } });
    console.log(user.username);
    let followTag = [];
    if (user) {
    followTag = await user.getHashtags({ include : [{ model : Page, include: [User,Hashtag] }] });
    }
    res.render('follow', {
        title:`follow | Anamorph`,
        user : req.user,
        followTag : followTag,
        loginError : req.flash('loginError'),
    });
});




module.exports = router;