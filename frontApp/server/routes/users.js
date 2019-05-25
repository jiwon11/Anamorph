var express = require('express');
// get gravatar icon from email
var gravatar = require('gravatar');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const{ isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Page,Hashtag,User,Comment,Like } = require('../../models');

var router = express.Router();
fs.readdir('profileImg', (error)=> {
  if(error) {
      console.error('profileImg 폴더가 없어 폴더를 생성합니다.');
      fs.mkdirSync('profileImg');
  }
});
/* GET users listing. */

router.get('/:userId', async(req,res,next) => {
  try {
    User.findOne({
      where : { username:req.params.userId },
      include : [{
          model : User,
          attributes : ['id', 'username','img'],
          as : 'Followers',
      }, {
          model : User,
          attributes : ['id', 'username','img'],
          as : 'Followings',
      }],
    })
    .then((user) => {
      var likePage=[];
      Like.findAll({
        where : { userLike : user.id },
        include : [{
          model : Page, 
          include: [User,Hashtag,Comment,Like]
        }]
      })
      .then((likePages) => {
        likePage.push(likePages);
      }).catch((error) => {
        console.error(error);
        next(error);
      });
    Page.findAll ({
      where : { userId : user.id },
      include : [{
        model : User,
        attributes : ['id', 'username','img'],
    }, {
        model : Hashtag,
        attributes : ['title'],
    }, {
        model : Comment,
    },{
        model : Like,
    },],
      order : [['createdAt', 'DESC']],
    })
    .then((pages) => {
      if(req.user) {
      res.render('profile', {
          title : `${user.username} | Anamorph`,
          pages : pages,
          user : req.user,
          result_user : user,
          likePage : likePage,
          gravatar: gravatar.url(user.email,{s:'80',r:'x',d:'retro'},true),
          logginError : req.flash('loginError'),
        });
      } else {
        res.render('profile', {
          title : `${user.username} | Anamorph`,
          pages : pages,
          user : req.user,
          result_user : user,
          likePage : likePage,
          gravatar: gravatar.url(user.email,{s:'80',r:'x',d:'retro'},true),
          logginError : req.flash('loginError'),
        });
      }  
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

  const upload = multer({
    storage : multer.diskStorage({
        destination(req, file, cb) {
            cb(null,'profileImg/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits : { fileSize : 5 * 1024 * 1024 },
});
router.post('/profileImg',isLoggedIn, upload.single('img'), (req,res) => {
    console.log(req.file);
    res.json({ url : `/profileImg/${req.file.filename}`});
});

const upload2 = multer();
router.post('/update', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
      User.update({
        email : req.body.email,
        username : req.body.username,
        img : req.body.url,
       },{
       where : { id : req.user.id }
      });
      res.redirect(`/users/${req.user.username}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  
  });

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

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
  try{
      const user = await User.find({ where : { id : req.user.id } });
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send('sucess');
  } catch (error) {
      console.error(error);
      next(error);
  }
});

module.exports = router;
