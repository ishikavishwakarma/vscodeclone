var express = require('express');
var router = express.Router();
const fs = require("fs");

/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readdir(`./uploads`, { withFileTypes: true }, (err, elems) => {
    if (err) console.log(err);
    else {
      res.render('index', { elems: elems });
    }
  }) 
});
router.get('/back', function (req, res, next) {
  res.redirect("/")
});

router.get('/file/:filename', function (req, res) {
  fs.readdir(`./uploads`, { withFileTypes: true }, (err, elems) => {
    fs.readFile(`./uploads/${req.params.filename}`,"utf-8",function(err,filedata){
      res.render('open', { elems,filename:req.params.filename,filedata});
    })
  })
});

router.post('/update/:filename', function (req, res, next) {
  fs.writeFile(`./uploads/${req.params.filename}`, req.body.data, function(err){
    res.redirect("back");
  })
});

router.post('/updatename/:oldname', function (req, res) {
  fs.rename(`./uploads/${req.params.oldname}`, `./uploads/${req.body.updatedname}`, function(err){
    res.redirect("back");
  })
});
router.get('/delete/:type/:filename', function (req, res) {
  if (req.params.type === "folder") {
    fs.rmdir(`./uploads/${req.params.filename}`,  (err) => { err ? console.log(err) : res.redirect("back"); });
  } else{
    fs.unlink(`./uploads/${req.params.filename}`, (err) => { err ? console.log(err) : res.redirect("back"); });
  }

});

router.get('/createfile', function (req, res) {
  fs.writeFile(`./uploads/${req.query.filename}`, "", (err) => {
    err ? res.send(err)
      : res.redirect("back");
  });
});

router.get('/createfolder', function (req, res) {
  fs.mkdir(`./uploads/${req.query.foldername}`, { recursive: true }, (err, path) => {
    err ? console.log(err)
      : res.redirect("back");
  });

});

module.exports = router;
