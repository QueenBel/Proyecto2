var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var multer = require('multer');
var fsgalRest = require('fs');

var HOUSE = require("./../database/casas");

var avatar = multer.diskStorage({
  destination : './public/avatar',
  filename : function(req, file, cb){
    console.log('-------------------');
    console.log(file);
    cb(null, file.originalname + "-" + Date.now() + ".jpg");

  }
});

var upload = multer({
  storage : avatar
});

router.post('/', upload.single('image'),(req, res) =>{
  var ruta = req.file.path.substr(6, req.file.path.length);
  var houses = {
    title: req.body.title,
    description: req.body.description,
    image: 'http://192.168.43.197:7070'+ ruta
  }
  var casaDATA = new HOUSE(houses);
  casaDATA.save().then((resultado) => {
    console.log(resultado);
    if(resultado){
      res.status(201).json({
        msn : 'resturante registrado'
      });
    } else{
      res.status(500).json({
        msn : "no se pudo registrar"
      });
    }
  })
});
/* GET home page. */
router.get('/', (req, res) => {
  HOUSE.find().exec((error, docs) =>{

    res.status(200).json({
      data: docs
    });
  })
});

module.exports = router;
