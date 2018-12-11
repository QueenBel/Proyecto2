var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var multer = require('multer');
var fsgalRest = require('fs');
//var mongoose = require("mongoose");

var RESTAURANT = require("../../database/collections/Restaurants");
var MENUS = require("../../database/collections/Menus");
var CLIENTE = require("../../database/collections/Clients");
var ORDER = require("../../database/collections/Orders");
var LOAD =require("../../utils/calcular");

/*CARGAR PEDIDOS EN LA BD*/

router.post('/orders', (req, res)=>{
  if(req.session.load== null){
    res.status(200).json({
        message: "no a ordenado nada"
      });
      return;
  }
//  RESTAURANT.findById(req.body.idRestorant);
//  MENUS.findById(req.body.idMenu);
  CLIENTE.findById(req.body.idCliente);

  var load2 = new LOAD(req.session.load);

  var pedido = {
    Menu : load2,
    //idRestorant : req.body.idRestorant,
    //FastFoods : load2,
    idCliente : req.body.idCliente,
    latPed : req.body.lat,
    lonPed : req.body.lon,
    direccionPed : req.body.address,
    pagoTotal : load2.totalPrice,
    cantidadTotal : load2.totalQuantity,
    fechaPedido :new Date
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
router.get('/orders', (req, res)=>{
  ORDER.find().select("_id Menu idCliente latPed lonPed direccionPed pagoTotal cantidadTotal").populate('cliente').exec().then((result)=>{
    var pedidos = result.map((doc)=>{
      return {
        id : doc._id,
        Menus : doc.Menu,
        Client : doc.idCliente,
        Latitud : doc.latPed,
        Longitud : doc.lonPed,
        Address : doc.direccionPed,
        PriceTotal: doc.pagoTotal,
        QuantytiTotal : doc.cantidadTotal
      };
    });
    res.status(200).json(pedidos);
  })
});


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
  var url = req.url;
  var menuId1 = url.split("/")[2];
  var load2 = new LOAD(req.session.load ? req.session.load : {});
  load2.reduceOneFood(menuId1);
  req.session.load = load2;
  res.status(200).json(req.session.load);
});

router.get(/deleteFoods\/[a-z0-9]{1,}$/, (req, res) =>{
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
  var totalPrecio = load1.totalPrice;
  var totalCantidad = load1.totalQuantity;
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

module.exports = router;
