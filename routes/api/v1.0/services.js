var express = require('express');
var multer = require('multer');
var router = express.Router();
var fsgalRest = require('fs');
var jwt = require("jsonwebtoken");
var sha1 = require('sha1');

//var _ = require("underscore");
var RESTAURANT = require("../../../database/collections/../../database/collections/Restaurants");
var MENUS = require("../../../database/collections/../../database/collections/Menus");
var CLIENT = require("../../../database/collections/../../database/collections/client");
var GALERIAREST = require("../../../database/collections/../../database/collections/galeriaRest");
var ORDER = require("../../../database/collections/../../database/collections/Orders");
var LOAD =require("../../../utils/calcular");
var CODIGO = require("../../../utils/auxiliar");
/*PEDIDOS DEL MENU QUE ARA DEL CLIENTE */
router.get('/addLoadFood/:id', (req, res)=>{

  var menuId = req.params.id;
  var load = new LOAD(req.session.load ? req.session.load : {})
  MENUS.findById(menuId, (err, menus)=>{
    load.add(menus, menus.id);
    req.session.load = load;
    console.log(req.session.load);
    res.status(200).json('menu cargado ');
  });
});

router.get(/reduceFoods\/[a-z0-9]{1,}$/, (req, res)=> {
  if(!req.session.load){
    res.status(200).json('no agregado');
    return;
  }
  var url = req.url;
  var menuId1 = url.split("/")[2];
  var load2 = new LOAD(req.session.load ? req.session.load : {});
  load2.reduceOneFood(menuId1);
  req.session.load = load2;
  res.status(200).json(req.session.load);
});

router.get(/deleteFoods\/[a-z0-9]{1,}$/, (req, res) =>{
  if(!req.session.load){
    res.status(200).json('no agregado nada ');
    return;
  }
  var url = req.url;
  var menuId2 = url.split("/")[2];
  var load3 = new LOAD(req.session.load ? req.session.load : {});
  load3.removeFoods(menuId2);
  req.session.load = load3;
  res.status(200).json("cancelo sus pedidos");
});

router.get('/viewFastFood',(req, res)=>{
  if(!req.session.load){
    res.status(200).json('no agregado nada en su pedido');
    return;
  }
  var load1 = new LOAD(req.session.load);
  var fastfood =  load1.generateArray();
  var totalPrecio = load1.totalPrecio;
  var totalCantidad = load1.totalCantidad;
  if(fastfood !=[] && totalCantidad != 0 && totalPrecio != 0){
    var data = {
      fastfood,
      totalPrecio,
      totalCantidad
    }
    res.status(200).json(data);
  } else {
    res.status(200).json('no agregado nada denada');
  }
});

router.post('/orders', verifytoken, (req, res)=>{
  var params = req.body;
  if(req.session.load== null){
    res.status(200).json({
        message: "no puede realizar su pedido"
      });
      return;
  }
  var codigo = CODIGO();
  var load2 = new LOAD(req.session.load);
  var pedido = {
    CodigoPed: codigo,
    Menu : load2,
    PagoTotal : load2.totalPrecio,
    CantidadTotal : load2.totalCantidad,
    NomCliente : params.name,
    CorrCliente : params.gmail,
    NitCedCliente : params.ci,
    LatPed : params.lat,
    LonPed : params.lng,
    DireccionPed : params.address, //street
    FechaPedido :new Date() //registerdate
  }
  var pedidoDATA = new ORDER(pedido);
  pedidoDATA.save().then((result) => {
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
  delete req.session.load;
});
router.get("/orders", (req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  ORDER.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.status(200).json({data: docs});
  });
});
router.get('/orders/:codigo', (req, res) =>{
  var url = req.url;
  var codigo = url.split('/')[2];
  ORDER.findOne({CodigoPed : codigo}).exec((err, docs) => {
    if (docs != null){
      res.status(200).json(docs);
      return;
    }
    res.status(200).json({
      msn : 'no existe recursos'
    });
  })
});
router.put("/orders", (req, res) => {
  var params = req.body;
  var id = req.query.id;
  var objupdate = {
    NombreRest : params.estado
  }
  ORDER.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
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
    console.log(docs);
  });
});

router.delete("/orders", (req, res) => {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  ORDER.find({_id: id}).deleteOne().exec((err, docs) => {
    res.status(200).json({
        msn: "eliminado"
    });
  })
});
/*USUARIOS MENUS Y RESTAURANTES*/

//verificacion verifytoken

//Middelware
function verifytoken (req, res, next) {
  //Recuperar el header
  const header = req.headers["authorization"];
  if (header  == undefined) {
      res.status(403).json({
        msn: "No autotizado"
      })
  } else {
      req.token = header.split(" ")[1];
      jwt.verify(req.token, "seponeunallavesecreta", (err, authData) => {
        if (err) {
          res.status(403).json({
            msn: "No autotizado"
          });
        } else {
          next();
        }
      });
  }
}




router.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  console.log(email,password);
  var result = CLIENT.findOne({email: email,password: sha1(password)}).exec((err, doc) => {
    if (err) {
      console.log("error");
      res.status(200).json({
        msn : "No se puede concretar con la peticion "
      });
      return;
    }
    if (doc) {
      //res.status(200).json(doc);
      jwt.sign({name: doc.email, password: doc.password}, "seponeunallavesecreta", (err, token) => {

          res.status(200).json({
            id : doc._id,
            token : token
          });
          console.log(token);
      })
    } else {
      console.log("error enviar token");
      res.status(200).json({
        msn : "El usuario no existe ne la base de datos"
      });
    }
  });
});
router.post("/client", (req, res) => {
  var client = req.body;
  //Validacion de datosssss
  var firstname_reg = /\w{3,}/g
  var surname_reg = /\w{3,}/g
  var email_reg = /\w{1,}@[\w.]{1,}[.][a-z]{2,3}/g
  var phone_reg = /\d{1}[0-9]/g
  var ci_reg =/\d{1,}\w{1,3}/g
  var password_reg =/\w{3,}/g
  console.log(client);
  if(client.firstname.match(firstname_reg) == null){
    res.status(400).json({
      msn : "el nombre de usuario no es correcto"
    });
    return;
  }
  if(client.surname.match(surname_reg) == null){
    res.status(401).json({
      msn : "el nombre de usuario no es correcto"
    });
    return;
  }
  if(client.email.match(email_reg) == null){
    res.status(402).json({
      msn : "el email no es correcto"
    });
    return;
  }
  if(client.password.match(password_reg) == null){
    res.status(403).json({
      msn : "el password no es correcto requiere mas de 6 caracteres "
    });
    return;
  }

  if(client.ci==undefined || client.ci.match(ci_reg) == null){
    res.status(404).json({
      msn : "el ci no puede estar vacio"
    });
    return;
  }
  if(client.phone.match(phone_reg) == null){
    res.status(405).json({
      msn : "el telefono es incorrecto"
    });
    return;
  }
  var clientdata = {
    firstname: client.firstname,
    surname: client.surname,
    email: client.email,
    phone: client.phone,
    ci: client.ci,
    password: sha1(client.password),
    registerdate: new Date
  };
  var cli = new CLIENT(clientdata);
  cli.save().then((docs) => {
    res.status(200).json({
      "id" : docs._id,
      "msn" : "se registro con exito"
    });
  });
});
router.get("/client",(req, res) => {

  CLIENT.find({}).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la base de datos"
      });
      return;
    }
    res.status(200).json(docs);
  });
});
router.patch('client/:id', function (req, res, next) {
  let idUser = req.params.id;
  let userData = {};
  Object.keys(req.body).forEach((key) => {
      userData[key] = req.body[key];
  })

  CLIENT.findByIdAndUpdate(idUser, userData).exec((err, result) => {
      if (err) {
          res.status(500).json({
              error: err
          });
          return;
      }
      if (result) {
          res.status(200).json({
              message: "Se actualizaron los datos"

          })
      }
  })
});

router.delete('client/:id', function (req, res, next) {
  let idUser = req.params.id;

  CLIENT.remove({
      _id: idUser
  }).exec((err, result) => {
      if (err) {
          res.status(500).json({
              error: err
          });
          return;
      }
      if (result) {
          res.status(200).json({
              message: "Usuario eliminado",
              result: result
          })
      }
  })
});
//API RESTAURANTE

router.post("/restaurant", verifytoken, (req, res) => {
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
    GaleriaRest : "",
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

router.patch("/restaurant", verifytoken, (req, res) => {
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
    NombreRest : params.name,
    NitRest : params.nit
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
    console.log(docs);
  });
});

router.delete("/restaurant", verifytoken, (req, res) => {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  RESTAURANT.find({_id: id}).deleteOne().exec((err, docs) => {
    res.status(200).json({
        msn: "eliminado"
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

router.post("/uploadrestaurant", verifytoken, (req, res) => {
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
        var url = req.file.path.replace(/public/g, "http://192.168.43.197:7070"+"");
        //var url = req.file.path.replace(/public/g, "http://192.168.1.110:7070"+"");

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
var CODIGO2 = require("../../../utils/auxiliar2");
//router.post("/menus/:idmenu", (req, res) => {
router.post("/menus", verifytoken, (req, res) => {
  var params = req.body;
  var namem_reg = /\w{3,}/g
   var pricem_reg =/\d{1,3}.\d{0,2}/g
   var desm_reg =/\w{3,}/g
   /*if(params.name.match(namem_reg) == null){
    res.status(200).json({
      msn : "no registrado el menu"
    });
    return;
  }*/
  var codigo=CODIGO2();
   RESTAURANT.findById(params.restaurant);
   var data = {
    CodigoMen : codigo,
    NombreMen : params.name,
    DescripcionMen : params.description,
    ProductoMen : "",
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
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  MENUS.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.status(200).json({data: docs});
  });
});

router.get(/menus\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var idMenu = url.split('/')[2];
  MENUS.findOne({_id : idMenu}).exec((err, docs) =>{
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    res.status(200).json(docs);
  });
});

router.patch("/menus", verifytoken, (req, res) => {
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
    var id = docs._id

    res.status(200).json({
      msn: id
    })
  });
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

router.delete("/menus", verifytoken, (req, res) => {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  MENUS.find({_id: id}).remove().exec((err, docs) => {
    res.status(200).json({
        msn: "eliminado"
    });
  })
});
/* /////// SUBIR IMAGENES PARA EL MENU*/

var storage_menu = multer.diskStorage({
  destination: "./public/menus",
  filename: function (req, file, cb) {
    console.log("-------------------------");
    console.log(file);
    cb(null, "MENU_" + Date.now() + ".png");
  }
});
var upload_menu = multer({
  storage: storage_menu
}).single("img");

router.post("/uploadmenus", verifytoken, (req, res) => {
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
        var url = req.file.path.replace(/public/g, "http://192.168.43.197:7070"+"");
        //var url = req.file.path.replace(/public/g, "http://192.168.1.110:7070"+"");
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
