const express = require('express');

// get gravatar icon from email
const gravatar = require('gravatar');

const { Page,Hashtag,User } = require('../../models');
const { isLoggedIn } = require('./middlewares');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = express.Router();

router.get('/:query', isLoggedIn, async(req,res,next) => {
    let searchWord = req.params.query;
    var results = {};
    await Hashtag.findAll({
        where:{
            title: {
                [Op.like]: "%" + searchWord + "%"
            }
        }
    })
    .then( result => {
        results['tags'] = result;
    })
    .catch( err => {
        console.log(err);
    });
    await User.findAll({
        where:{
            Username: {
                [Op.like]: "%" + searchWord + "%"
            }
        },
        attributes : ['id', 'username','img'],
    })
    .then( result => {
        results['user'] = result;
        res.json(results);
    })
    .catch( err => {
        console.log(err);
    });
});



module.exports = router;