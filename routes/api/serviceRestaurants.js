var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var multer = require('multer');
var fsgalRest = require('fs');


var RESTAURANT = require("../../database/collections/Restaurants");
var GALERIAREST = require("../../database/collections/galeriaRest");

var carpetaLogo = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, './public/logos');
  },

  filename : function(req, file, cb,){
    cb(null, new Date().toISOString() + file.originalname);
  }
});

var fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var cargarLogo = multer({
  storage : carpetaLogo,
  limits : {
    fileSize : 1024*1024*5
  },
  fileFilter : fileFilter
});

router.post('/restaurants', cargarLogo.single('LogoRest'),(req, res) =>{

  var restaurantBD = {
    NombreRest : req.body.nameR,
    NitRest : req.body.nitR,
    PropietarioRest : req.body.proprietorR,
    CalleRest : req.body.streetR,
    TelefonoRest : req.body.phoneR,
  //  LogRest : req.body.LogR,
  //  LatRest : req.body.latR,
    LogoRest : req.file.path,
    GaleriaRest : '',
    FechaRegistro: new Date()
  }
  var restauranteDATA = new RESTAURANT(restaurantBD);
  restauranteDATA.save().then((resultado) => {
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

router.get('/restaurants', (req, res) => {
  RESTAURANT.find({}).exec((error, docs) =>{
    res.status(200).json(docs);
  })
});

router.get('/restaurants/:idRest', (req, res) =>{
  var url = req.url;
  var idRest = url.split('/')[2];
  RESTAURANT.findOne({_id : idRest}).exec((err, docs) =>{
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({
      msn :' No existe el recurso '
    });
  })
});

/*CARGAR LAS GALERIA DE FOTOS DEL RESTAURANTE*/

var carpRestaurante = multer.diskStorage({
  destination : './public/restaurant',
  filename : function(req, file, cb){
    console.log('-------------------');
    console.log(file);
    cb(null,file.originalname);

  }
});

var cargar = multer({
  storage : carpRestaurante
}).single('gallery');;

router.post('/galleryR', (req, res) =>{
  cargar(req, res, (err) =>{
    if(err) {
      res.status(500).json({
        msn : 'nu se puede subir img'
      });
    } else {
      var rutaURL = req.file.path.substr(6, req.file.path.length);
      console.log(rutaURL);
      var gallery = {
        name : req.file.originalname,
        pathFisico : req.file.path,
        pathURL : '' + rutaURL,
        //restID : req.body.IDrest,
        date :  new Date()
      };
      var galRestDATA = new GALERIAREST(gallery);
      galRestDATA.save().then((infoIMG) => {
        console.log(infoIMG);
        if(infoIMG){
          res.status(201).json({
            msn : 'PERFECTO'
          });
        } else{
          res.status(500).json({
            msn : "no se pudo "
          });
        }
      })
    }
  });
});
router.get('/galleryR/:idGalR', (req, res) =>{
  var url = req.url;
  var idGalR = url.split('/')[2];
  GALERIAREST.findOne({_id : idGalR}).exec((err, docs) =>{
    if (err) {
      res.status(500).json({
        msn : 'Sucedio algun error en el servicio'
      });
      return;
    }
    //regresamos la imagen deseada
    var img = fsgalRest.readFileSync("./" + docs.pathFisico);
    //var img = fs.readFileSync("./public/avatars/img.jpg");
    res.contentType('image/jpeg');
    res.status(200).send(img);
  });
})

router.get('/galleryR',  (req, res) => {
  GALERIAREST.find({}).exec((error, docs) => {
    res.status(200).json(docs);
  })
});
module.exports = router;
