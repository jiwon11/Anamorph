var express = require('express');
var JSZip = require("jszip");
var fs = require("fs");

const { Post,Model } = require('../models');
var router = express.Router();

router.get('/:postId', async (req, res, next) => {
    const postId = req.params.postId;
    if(!postId) {
        return res.redirect('/');
    }
    try{
    await Post.findOne({ 
        where : { id : postId },
     })
    .then(post => {
        new JSZip.external.Promise(function (resolve, reject) {
            fs.readFile(`.${post.gltf_file}`, function(err, data) {
                if(err) {
                    throw err;
                } else {
                JSZip.loadAsync(data).then(function (zip) {
                    const promises = [];
                    var folderList =[];
                    var types=[];
                    zip.forEach(function (relativePath, zipEntry) {
                        if(!zipEntry.dir && !zipEntry.name.match(/\.(DS_Store)$/)) {
                          folderList.push(zipEntry.name);
                          types.push(zipEntry.name.split(".")[1]);
                          if(zipEntry.name.match(/\.(gltf|glb)$/)) {
                            promises.push(zip.file(zipEntry.name).async("base64").then(function (data) {
                              return data; 
                            }));
                          } else if(zipEntry.name.match(/\.(jpg|png|jpeg)$/)){
                              promises.push(zip.file(zipEntry.name).async("base64").then(function (data) {
                                return data; 
                              }));
                            } else {
                              promises.push(zip.file(zipEntry.name).async("base64").then(function (data) {
                                return data; 
                              }));
                            }
                        }
                    });
                    var file = [];
                    Promise.all(promises).then(function (blobList) {
                      for(var i=0;i<blobList.length;i++){
                        var blobs = {};
                        blobs.name = folderList[i];
                        blobs.data = blobList[i];
                        blobs.type = types[i];
                        file.push(blobs);
                      }
                    res.render('postViewer', {
                        title : `${post.title} | Viewport`,
                        post : post,
                        zipfile : JSON.stringify(file),
                    });
                    });
                });
                }
              });
            });
        });
    } catch (error) {
    console.error(error);
    return next(error);
    }
});

module.exports = router;