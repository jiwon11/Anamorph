var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

var router = express.Router();

fs.readdir('uploads/backgroundImg', (error)=> {
  if(error) {
      console.error('uploads 폴더가 없어 폴더를 생성합니다.');
      fs.mkdirSync('uploads/backgroundImg');
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
          cb(null,`uploads/gltf/`);
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
    res.render('index', { 
      title: `GLTF Upload | Viewport`, 
    });
  });

var cpUpload = upload.fields([{ name: 'backgroundImg'}, { name: 'gltf'}]);
router.post('/gltf', cpUpload, function (req, res, next) {
  console.log(req.files);
  res.json({ 
    
  });
  
  //res.json({ url : `/img/${req.file.filename}`});
});

router.post('/gltfUpload',upload2.none(),async (req, res, next) => {
    try {
        console.log(req.body);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.post('/gltfZipUpload',upload.single('gltf'),async (req, res, next) => {
  try {
      console.log(req.file);
      var fileSize;
      if(req.file.size<1000000) {
        fileSize = req.file.size/1000;
      } else {
        fileSize = req.file.size/1000000;
        fileSize = `${fileSize.toFixed(1)} MB`;
      }
      res.json({ 
        url : `/${req.file.path}`,
        size : `${fileSize}`,
      });
  } catch (error) {
      console.error(error);
      next(error);
  }
});


module.exports = router;
