var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var ipcalc =require("../../utils/ipcalc");
var calsubnet =require("../../utils/calsubnet");

router.post("/subnet", (req, res)=>{
  var data = req.body;
  if(data.ip == null){
    res.status(300).json({
      msn: "error en el formato de datos"
    });
    return;
  }
  if(data.mask == null){
    res.status(300).json({
      msn: "error en el formato de datos"
    });
    return;
  }
  if(data.host == null){
    res.status(300).json({
      msn: "error en el formato de datos"
    });
    return;
  }
  var rex_ip = /\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/g
  if(data.ip.match(rex_ip) == undefined){
    res.status(300).json({
      msn: "ip mal escrita"
    });
    return;
  }
  var rex_mask = /\d{1,31}/g
  if(data.mask.match(rex_mask) == undefined){
    res.status(300).json({
      msn: "la mascara debe estar ente 1 y 31"
    });
    return;
  }
  var rex_host = /\d{1,31}/g
  if(data.host.match(rex_host) == undefined){
    res.status(300).json({
      msn: "error en los host formato invalido"
    });
    return;
  }
  var mask = parseInt(data.mask,10);
  var host = parseInt(data.host, 10);
  var hosstrestantes = 32 - mask;
  if(host > hosstrestantes){
    res.status(300).json({
      msn: "los bits host n pueden ser mayores a 32 - " + mask
    });
    return;
  }
  //lo serio
  var red = hosstrestantes - host;
  //si tengo una ip
  // 192.168.1.5/8
  // ip host = 11
  //ip >8 ip <16
  //hostvariables = 11 - 8 = 3
  // 3 bits
  //2^3 = 8
  //2^3-1 = 7
  //bvhost = bits variables de host
  var octeto = null;
  var bvhost = null;
  if(host < 8 ){
    bvhost = host -0 * 8;
    octeto = 3;
  }
  if(host > 8 && host < 2*8 ){
    bvhost = host -1 * 8;
    octeto = 2;
  }
  if(host > 16 && host < 3*8 ){
    bvhost = host -2 * 8;
    octeto = 1;
  }
  if(host > 24 && host < 3*8 ){
    bvhost = host -2 * 8;
    octeto = 0;
  }
  var redsalto = Math.pow(2, bvhost);
  var redanterior = redsalto - 1;
  //utilizando el ipcalc.js
  var result = new ipcalc(data.ip, mask);
  console.log(redsalto);
  console.log(red); // los bits que hay
  var networdlong = Math.pow(2, red); //la catidad de redes q exit
  var hostlong = Math.pow(2, host) - 2; //la cnatidad de host
  result["Networdlong"] = networdlong;
  result["Hostlong"] = hostlong;

  var ipgenerator = result["ipdec"].split(".");

  //  var rango_host = [];
    //var broad_cast = [];
    var network = [];

  var current_octeto=parseInt(ipgenerator[octeto], 10);


  for(var i = 0 ; i < networdlong-1; i++){
  //  console.log(ipgenerator[0]+"."+ipgenerator[1]+"."+ipgenerator[2]+"."+ipgenerator[3]);
    current_octeto += redsalto;

    var primerautilizable = null;
    primerautilizable = parseInt(ipgenerator[3], 10) + 1;

    var networkip = ipgenerator[0]+"."+ipgenerator[1]+"."+ipgenerator[2]+"."+ipgenerator[3];

    ipgenerator = calsubnet(current_octeto, ipgenerator, octeto);
    current_octeto = parseInt(ipgenerator[octeto], 10);

    var broadcast = null;
    broadcast = parseInt(ipgenerator[3], 10) - 1;
    var ultimaipreutilizable = broadcast - 1;

    var cad = ipgenerator[0]+"."+ipgenerator[1]+"."+ipgenerator[2]+"."+ primerautilizable + "---" + ipgenerator[0]+"."+ipgenerator[1]+"."+ipgenerator[2]+"."+ ultimaipreutilizable;
    //rango_host.push(cad);
  //  broad_cast.push(ipgenerator[0]+"."+ipgenerator[1]+"."+ipgenerator[2]+"."+ broadcast);
    //network.push(ipgenerator[0]+"."+ipgenerator[1]+"."+ipgenerator[2]+"."+ipgenerator[3]);
      network.push([networkip, cad, ipgenerator[0]+"."+ipgenerator[1]+"."+ipgenerator[2]+"."+ broadcast]);
//    result["rango_host"] = rango_host;
  //  result["broad_cast"] = broad_cast;
    result["network"] = network;

  }
  res.status(300).json(result);
//ACACABO VID 1 EN EL 1:18:00


});

module.exports = router;
