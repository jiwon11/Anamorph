var express = require('express');
const{ isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User,Page,Hashtag } = require('../../models');

var router = express.Router();

/* GET users listing. */

router.get('/:userId',isLoggedIn, async(req,res,next) => {
  try {
    User.findOne({ where : { username : req.params.userId } })
    .then((user) => {
    Page.findAll ({
      where : { userId : user.id },
      include : {
          model : User,
          attributes : ['id', 'username'],
      },
      order : [['createdAt', 'DESC']],
    })
    .then((pages) => {
      res.render('profile', {
          title : `${user.username} | Anamorph`,
          pages : pages,
          user : user,
          logginError : req.flash('loginError'),
      });
    })
    .catch((error) => {
        console.error(error);
        next(error);
    });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
  });

    /*
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.find({ where : { id : req.user.id } });
    await user.addFollowing(parseInt(req.params.id, 10));
    res.send('sucess');
  } catch (error) {
    console.error(error);
    next(error);
  }
});
*/
module.exports = router;
