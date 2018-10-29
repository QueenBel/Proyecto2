var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var multer = require('multer');
var fsgalMen = require('fs');


var MENUS = require("../../database/collections/Menus");
var GALERIAMEN = require("../../database/collections/galeriaMen");


router.post('/menus', (req, res) =>{

  var menu = {
    TipoMen : req.body.type,
    NombreMen : req.body.name,
    DescripcionMen: req.body.detalls,
    ProductoMen: '',
    PrecioMen : req.body.price,
    date : new Date
  }
  var menuDATA = new MENUS(menu);
  menuDATA.save().then((result) => {
    console.log(result);
    if(result){
      res.status(201).json({
        "msn" : "menu registrado"
      });
    } else{
      res.status(500).json({
        "msn" : "no se pudo resgistra"
      });
    }
  })
});

router.get('/menus', (req, res) => {
  MENUS.find({}).exec((error, docs) =>{
    res.status(200).json(docs);
  })
});

router.get(/menus\/[a-z0-9]{1,}$/, (req, res) =>{
  var url = req.url;
  var idMen = url.split("/")[2];
  MENUS.findOne({_id : idMen}).exec((err, docs) =>{
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({
      "msn" : "no existe recursos"
    });
  })
});

/*CARGAR LAS GALERIA DE FOTOS DEL RESTAURANTE*/

var carpMenu = multer.diskStorage({
  destination : './public/menu',
  filename : function(req, file, cb){
    console.log('-------------------');
    console.log(file);
    cb(null, file.originalname + "-" + Date.now() + ".jpg");

  }
});

var upload = multer({
  storage : carpMenu
});

router.post(/galeriaM\/[a-z0-9]{1,}$/, upload.single('galleryMen'), (req, res) =>{
  var url = req.url;
  var IDmen = url.split('/')[2];
      var ruta = req.file.path.substr(6, req.file.path.length);
      console.log(ruta);

      var galleryMen = {
        nameimg : req.file.originalname,
        phiscalpath: req.file.path,
        relativepath : '' + ruta,
        menID : IDmen,
        date :  new Date()
      };
      var galMenDATA = new GALERIAMEN(galleryMen);
      galMenDATA.save().then((info) => {
        console.log(info);
        var menu= {
          ProductoMen : new Array()
        }
        MENUS.findOne({_id : IDmen}).exec((err, docs) =>{
          console.log(docs);
          var data = docs.ProductoMen;
          var aux = new Array();
          if(data.length == 1 && data[0] == ''){
            menu.ProductoMen.push('http://localhost:7070/api/galeriaM/' + info._id)

          }else {
            aux.push('http://localhost:7070/api/galeriaM/' + info._id);
            data = data.concat(aux);
              menu.ProductoMen = data;
          }
          MENUS.findOneAndUpdate({_id : IDmen }, menu, (err, params) => {
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
});
router.get('/galeriaM/:idGalM', (req, res) =>{
  var url = req.url;
  var idGalM = url.split('/')[2];
  GALERIAMEN.findOne({_id : idGalM}).exec((err, docs) =>{
    if (err) {
      res.status(500).json({
        msn : 'Sucedio algun error en el servicio'
      });
      return;
    }
    var photo = fsgalMen.readFileSync("./" + docs.phiscalpath);
    res.contentType('image/jpeg');
    res.status(200).send(photo);
  });
})

router.get('/galeriaM',  (req, res) => {
  GALERIAMEN.find({}).exec((error, docs) => {
    res.status(200).json(docs);
  })
});
module.exports = router;
