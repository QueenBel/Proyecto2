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
  fileFilter : fileFilter
});

router.post('/restaurants', cargarLogo.single('LogoRest'),(req, res) =>{
 //este var restaurante ===== a la BD mongo module.exports = restaurante;

  var restaurante = {
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
  var restauranteDATA = new RESTAURANT(restaurante);
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

router.get(/restaurants\/[a-z0-9]{1,}$/, (req, res) =>{
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
}).single('gallery');;  //single('gallery');; ==== de la bd module.exports = gallery;

router.post(/galleryR\/[a-z0-9]{1,}$/, (req, res) =>{
  var URL = req.url;
  var IDrest = URL.split('/')[2];

  cargar(req, res, (err) =>{
    if(err) {
      res.status(500).json({
        msn : 'nu se puede subir img'
      });
    } else {
      var rutaURL = req.file.path.substr(6, req.file.path.length);
      console.log(rutaURL);
//var gallery = { =====  de la bd module.exports = gallery;      
      var gallery = {
        name : req.file.originalname,
        pathFisico : req.file.path,
        pathURL : 'http://localhost:7070' + rutaURL,
        restID : IDrest,
        date :  new Date()
      };
      var galRestDATA = new GALERIAREST(gallery);
      galRestDATA.save().then((infoIMG) => {
        console.log(infoIMG);
//este var restaurante ===== a la BD mongo module.exports = restaurante;
        var restaurante = {
          GaleriaRest : new Array()
        }
        RESTAURANT.findOne({_id : IDrest}).exec((err, docs) =>{
          console.log(docs);
          var galrest = docs.GaleriaRest;
          var aux = new Array();
          if(galrest.length == 1 && galrest[0] == ''){
            restaurante.GaleriaRest.push('http://localhost:7070/api/galleryR/' + infoIMG._id)

          }else {
            aux.push('http://localhost:7070/api/galleryR/' + infoIMG._id);
            galrest = galrest.concat(aux);
            restaurante.GaleriaRest = galrest;
          }
          RESTAURANT.findOneAndUpdate({_id : IDrest }, restaurante, (err, params) => {
            if (err){
              res.status(500).json({
                msn : 'error en la actualizacion del restaurante'
              });
              return;
            }
            res.status(200).json(
              req.file
            );
            return;
          });
        });
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
