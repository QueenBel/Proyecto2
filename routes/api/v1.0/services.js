var express = require('express');
var multer = require('multer');
var router = express.Router();
var fsgalRest = require('fs');
var sha1 = require('sha1');
//var _ = require("underscore");
var RESTAURANT = require("../../../database/collections/../../database/collections/Restaurants");
var MENUS = require("../../../database/collections/../../database/collections/Menus");
var CLIENT = require("../../../database/collections/../../database/collections/Clients");
var GALERIAREST = require("../../../database/collections/../../database/collections/galeriaRest");
var jwt = require("jsonwebtoken");
function verifytoken (req, res, next) {
  //Recuperar el header
  const header = req.headers["authorization"];
  if (header  == undefined) {
      res.status(403).json({
        msn: "No autotizado"
      })
  } else {
      req.token = header.split(" ")[1];
      jwt.verify(req.token, "isabel777", (err, authData) => {
        if (err) {
          res.status(403).json({
            msn: "No autotizado"
          })
        } else {
          next();
        }
      });
  }
}

router.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var result = CLIENT.findOne({CorreoCli:email, password: password}).exec((err, doc) => {
    if (err) {
      res.status(200).json({
        msn : "No se puede concretar con la peticion "
      });
      return;
    }
    if (doc) {
      //res.status(200).json(doc);
      jwt.sign({name: doc.CorreoCli, password: doc.password}, "isabel777", (err, token) => {
          console.log(err);
          res.status(200).json({
            token : token
          });
      })
    } else {
      res.status(200).json({
        msn : "El usuario no existe ne la base de datos"
      });
    }
  });
});
router.post("/client", (req, res) => {
  var client = {
    NombreCli : req.body.name,
    NitCli : req.body.nit,
    CelularCli : req.body.phone,
    CorreoCli : req.body.email,
    password : req.body.password,
    registerdate : new Date()
  };
  var cli = new CLIENT(client);
  cli.save().then((docs) => {
    res.status(200).json(docs);
  });
});
//API RESTAURANTE

router.post("/restaurant", (req, res) => {
  var params = req.body;
  var nameReg= /^[a-zA-Z0-9]{3,}$/g
  var nitReg= /^[a-zA-Z0-9]{3,}$/g
  var propertyReg= /^[a-zA-Z0-9]{3,}$/g
  var streetReg= /^[a-zA-Z0-9]{3,}$/g
  var phoneReg= /^[a-zA-Z0-9]{3,}$/g

  var data = {
    NombreRest : params.name,
    NitRest : params.nit,
    PropietarioRest : params.property,
    CalleRest : params.street,
    TelefonoRest : params.phone,
    LatRest : params.lat,
    LonRest : params.log,
    LogoRest : "",
    //GaleriaRest : '',
    FechaRegistro: new Date()
  };
  var newrestaurant = new RESTAURANT(data);
  newrestaurant.save().then( (rr) => {
    //content-type
    res.status(200).json({
      "id" : rr._id,
      "msn" : "Restaurante Agregado con exito"
    });
    console.log(rr);
  });
});

router.get("/restaurant", (req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  RESTAURANT.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.status(200).json({data: docs});
  });
});

router.get(/restaurant\/[a-z0-9]{1,}$/,(req, res) => {
  var url = req.url;
  var idRest = url.split('/')[2];
  RESTAURANT.findOne({_id : idRest}).exec((err, docs) =>{
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    res.status(200).json(docs);
  });
});

router.patch("/restaurant",(req, res) => {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  var keys = Object.keys(params);
  var updatekeys = ["NombreRest", "NitRest", "PropietarioRest", "CalleRest", "TelefonoRest", "LatRest", "LonRest", "LogoRest", "GaleriaRest"];
  var newkeys = [];
  var values = [];
  //seguridad
  for (var i  = 0; i < updatekeys.length; i++) {
    var index = keys.indexOf(updatekeys[i]);
    if (index != -1) {
        newkeys.push(keys[index]);
        values.push(params[keys[index]]);
    }
  }
  var objupdate = {}
  for (var i  = 0; i < newkeys.length; i++) {
      objupdate[newkeys[i]] = values[i];
  }
  console.log(objupdate);
  RESTAURANT.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    var id = docs._id
    res.status(200).json({
      msn: id
    })
  });
});

router.put("/restaurant",(req, res) => {
  var params = req.body;
  var id = req.query.id;
  var objupdate = {
    NombreRest: params.name,
    NitRest: params.nit
  }
  RESTAURANT.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    var id = docs._id
    res.status(200).json({
      msn: id
    })
  });
});

router.delete("/restaurant",(req, res) => {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  RESTAURANT.find({_id: id}).remove().exec((err, docs) => {
    res.status(500).json({
        docs
    });
  })
});

/*SUBIR IMAGENES*/
var storage = multer.diskStorage({
  destination: "./public/restaurants",
  filename: function (req, file, cb) {
    console.log("-------------------------");
    console.log(file);
    cb(null, "IMG_" + Date.now() + ".png");
    //cb(null, new Date().toISOString() + file.originalname);
  }
});

var upload = multer({
  storage: storage
  //fileFilter: fileFilter1
}).single("img1");

router.post("/uploadrestaurant",(req, res) => {
  var params = req.query;
  var id = params.id;
  var SUPERES = res;
  RESTAURANT.findOne({_id: id}).exec((err, docs) => {
    if (err) {
      res.status(501).json({
        "msn" : "Problemas con la base de datos"
      });
      return;
    }
    if (docs != undefined) {
      upload(req, res, (err) => {
        if (err) {
          res.status(500).json({
            "msn" : "Error al subir la imagen"
          });
          return;
        }
        var url = req.file.path.replace(/public/g, "http://192.168.1.110:7070"+"");

        RESTAURANT.updateOne({_id: id}, {$set:{LogoRest:url}}, (err, docs) => {
          if (err) {
            res.status(200).json({
              "msn" : err
            });
            return;
          }
          res.status(200).json(docs);
        });
      });
    }
  });
});
//PARA LA GALERIA
var storage = multer.diskStorage({
  destination: "./public/restaurants",
  filename: function (req, file, cb) {
    console.log("-------------------------");
    console.log(file);
    cb(null, "GAL_" + Date.now() + ".png");
    //cb(null, new Date().toISOString() + file.originalname);
  }
});

var cargar = multer({
  storage: storage
  //fileFilter: fileFilter1
}).single("gallery");
router.post(/galleryR\/[a-z0-9]{1,}$/,  (req, res) =>{
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
        pathURL : '' + rutaURL,
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
            restaurante.GaleriaRest.push('/api/v1.0/galleryR/' + infoIMG._id)

          }else {
            aux.push('/api/v1.0/galleryR/' + infoIMG._id);
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
////////*****MENUS*****/////////////////////////*****MENUS****//////

router.post("/menus", (req, res) => {
  var params = req.body;

   var data = {
    NombreMen : params.name,
    DescripcionMen : params.description,
    ProductoMen : '',
    PrecioMen : params.price,
    idrestaurant : params.restaurant,
    registerdate: new Date()
  };
  var newmenus = new MENUS(data);
  newmenus.save().then( (rr) => {
    //content-type
    res.status(200).json({
      "id" : rr._id,
      "msn" : "Menu Agregado con exito"
    });
    console.log(rr);
  });
});

router.get("/menus", (req, res) => {
  MENUS.find().then((docs) =>{
    var menus=docs.map((doc)=>{
      return({
        id: doc._id,
        name:doc.NombreMen,
        description: doc.DescripcionMen,
        restaurante: doc.idrestaurant,
        precio:doc.PrecioMen,
        picture:doc.ProductoMen,
        fecha:doc.registerdate,
        agregar:{
          url:'http://localhost:7070/api/addLoadFood/'+doc._id
        }
      });
    })
    res.status(200).json(menus);
  })
});

router.get(/menus\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var idMenu = url.split('/')[2];
  MENUS.findOne({_id : idMenu}).exec((err, docs) =>{
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({
      msn :' No existe el recurso '
    });
  })
});

router.patch("/menus", (req, res) => {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  var keys = Object.keys(params);
  var updatekeys = ["NombreMen", "DescripcionMen", "ProductoMen", "PrecioMen"];
  var newkeys = [];
  var values = [];
  //seguridad
  for (var i  = 0; i < updatekeys.length; i++) {
    var index = keys.indexOf(updatekeys[i]);
    if (index != -1) {
        newkeys.push(keys[index]);
        values.push(params[keys[index]]);
    }
  }
  var objupdate = {}
  for (var i  = 0; i < newkeys.length; i++) {
      objupdate[newkeys[i]] = values[i];
  }
  console.log(objupdate);
  MENUS.findOneAndUpdate({_id: id}, objupdate, (err, docs) => {
    if (err) {
      res.status(500).json({
        msn: "error en la bd"
      });
      return;
    }
    res.status(200).json(docs);
  })
});

router.put("/menus", (req, res) => {
  var params = req.body;
  var id = req.query.id;
  var objupdate = {
    idrestaurant: params.restaurant
  }
  MENUS.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    var id = docs._id
    res.status(200).json({
      msn: id
    })
  });
});

router.delete("/menus", (req, res) => {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  MENUS.find({_id: id}).remove().exec((err, docs) => {
    res.status(500).json({
        docs
    });
  })
});
/* /////// SUBIR IMAGENES PARA EL MENU*/

var storage_menu = multer.diskStorage({
  destination: "./public/menus",
  filename: function (req, file, cb) {
    console.log("-------------------------");
    console.log(file);
    cb(null, "MENU_" + Date.now() + ".jpg");
  }
});
var upload_menu = multer({
  storage: storage_menu
}).single("img");;

router.post("/uploadmenus", (req, res) => {
  var id = req.query.id;
  if (id == null) {
    res.status(300).json({
      "msn": "especifique un id valido"
    });
    return;
  }
  MENUS.find({_id:id}).exec((err, docs)=>{
    if(err){
      res.status(300).json({
        "msn":"problemas con la BD"
      });
      return;
    }
    if(docs.length != null){
      //subir archivo upload_menu
      upload_menu(req, res, (err)=>{
        if (err) {
          res.status(300).json({
            "msn":"error al subir image"
          });
          return;
        }
        var url = req.file.path.replace(/public/g,"http://192.168.1.110:7070"+"");
        MENUS.updateOne({_id:id}, {$set:{ProductoMen:url}}, (err, docs) =>{
          res.status(200).json({
            "msn":"exito"
          });
          return;
        });
      });
    }else {
      res.status(300).json({
        "msn":"el id no se encotro"
      });
      return;
    }
  });
});
module.exports = router;
