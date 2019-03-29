const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn,isNotLoggedIn } = require('./middlewares');
const { User } = require('../../models');

const router = express.Router();
router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    const {email, username, password } = req.body;
    try {
        const exUser = await User.find({ Where : { email } });
        if(exUser) {
            req.flash('joinError', 'You are already a member');
            return res.redirect('/signup');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            username,
            password : hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return(error);
    }
});

router.post('/login',isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.log(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/pages');
        });
    }) (req, res, next);
});
router.get('/logout',isLoggedIn, (req,res) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;