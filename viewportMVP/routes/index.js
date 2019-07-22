var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var model = '/GLTF/scene.gltf';
  res.render('index', { 
    title: `GLTFLoader | Viewport`, 
    model : model,
  });
});


module.exports = router;
