var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var multer = require('multer');
var fsgalMen = require('fs');


var CLIENTE = require("../../database/collections/Clients");


router.post('/clients', (req, res) =>{

  var cliente = {
    NombreCli : req.body.name,
    NitCli : req.body.nit,
    CelularCli : req.body.Cellphone,
    CorreoCli : req.body.email
  }
  var clienteDATA = new CLIENTE(cliente);
  clienteDATA.save().then((result) => {
    console.log(result);
    if(result){
      res.status(201).json({
        "msn" : "cliente guardado"
      });
    } else{
      res.status(500).json({
        "msn" : "no se pudo guardar"
      });
    }
  })
});

router.get('/clients', (req, res) => {
  CLIENTE.find({}).exec((error, docs) =>{
    res.status(200).json(docs);
  })
});

router.get(/clients\/[a-z0-9]{1,}$/, (req, res) =>{
  var url = req.url;
  var idCli = url.split("/")[2];
  CLIENTE.findOne({_id : idCli}).exec((err, docs) =>{
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({
      "msn" : "no existe recursos"
    });
  })
});


module.exports = router;
