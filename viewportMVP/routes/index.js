var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Post,Model } = require('../models');
var router = express.Router();

fs.readdir('uploads/previewImg', (error)=> {
  if(error) {
      console.error('uploads 폴더가 없어 폴더를 생성합니다.');
      fs.mkdirSync('uploads/previewImg');
  }
});
fs.readdir('uploads/gltf', (error)=> {
  if(error) {
      console.error('uploads 폴더가 없어 폴더를 생성합니다.');
      fs.mkdirSync('uploads/gltf');
  }
});

const upload = multer({
  storage : multer.diskStorage({
      destination(req, file, cb) {
          cb(null,`uploads/${file.fieldname}/`);
      },
      filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
      },
  }),
  limits : { fileSize : 100 * 1024 * 1024 },
});

const upload2 = multer();
/* GET home page. */
router.get('/', function(req, res, next) {
    Post.findAll({
      /*
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
      */
      order : [['createdAt','DESC']],
  })
  .then (async (pages) => {
          //const tags = await Hashtag.findAll({ });
          res.render('index', {
              title : `GLTF Upload | Viewport`,
              pages : pages,
              //user : req.user,
              //gravatar: gravatar.url(req.user.email,{s:'80',r:'x',d:'retro'},true),
              //tags : tags,
              loginError : req.flash('loginError'),
          });
  })
    .catch((error) => {
        console.error(error);
        next(error);
    });
});

router.post('/gltfUpload',upload2.none(),async (req, res, next) => {
    try {
        console.log(req.body);
        const post = await Post.create({
          title : req.body.title,
          description : req.body.description,
          gltf_file : req.body.gltfUrl,
          preview_img : req.body.previewImg,
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.post('/gltfZipUpload',upload.fields([{ name: 'gltf' }, { name: 'previewImg' }]),async (req, res, next) => {
  try {
      var gltf = req.files.gltf[0];
      var previewImg = req.files.previewImg[0];
      res.json({ 
        gltfUrl : `/${gltf.path}`,
        previewImgUrl : `/${previewImg.path}`,
      });
  } catch (error) {
      console.error(error);
      next(error);
  }
});


module.exports = router;
