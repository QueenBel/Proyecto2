var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var USER = require("../../database/usersModel");
var BOOKS = require("../../database/libro");
var COMPRAR = require("../../database/comprar");

router.post('/compra/:idl', (req, res)=>{
  var url = req.url;
  var idl = url.split("/")[2];
  //var url2 = req.url;
  //var idu = url2.split("&")[2];

  var comprars = {
    tiempo: req.body.tiempo,
    prenda: req.body.prenda,
    usuario: req.body.usuario,
    libro1: idl,
    registerDate: new Date
  }
  var comprarDATA = new COMPRAR(comprars);
  comprarDATA.save().then((info)=>{
    res.status(200).json(info);
  })
});
router.get('/compra', (req, res) => {
  COMPRAR.find({}).exec((error, docs) =>{
    res.status(200).json(docs);
  })
});

router.post('/libro', function(req, res){
  var libros ={
    name: req.body.name,
    precio: req.body.precio,
    registerDate: new Date
  }
  var libroDATA = new BOOKS(libros);
  libroDATA.save().then((result) => {
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
router.get('/libro', (req, res) => {
  BOOKS.find({}).exec((error, docs) =>{
    res.status(200).json(docs);
  })
});

router.post('/user', function(req, res) {
  var params = req.body;
  var name_reg = /^[a-zA-Z0-9]{3,}$/g
  var last_reg = /^[a-zA-Z0-9]{3,}$/g
  var result = params.name.match(name_reg)
  if ( result == null) {
    res.status(400).json({
      msns: "El nombre de usuario no es correcto"
    });
    return;
  }
  if (params.lastname.match(last_reg) == null) {
    res.status(400).json({
      msns: "El nombre  no es correcto"
    });
    return;
  }

  var us = {
    name: params.name,
    lastname: params.lastname,
    //password: sha1(params.password),
    registerDate: new Date()
  }
  var userDB = new USER(us);
  userDB.save().then( (result) => {
    if (result) {
      res.status(201).json({
        msns: "Usuario Creado"
      });
    } else {
      res.status(500).json({
        msns: "Existe un error en la base de datos"
      });
    }
  });
});

router.get('/user', (req, res) => {
  USER.find({}, (err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    res.status(200).json({
      docs
    });
  });
});



module.exports = router;
