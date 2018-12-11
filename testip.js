//console.log(convertMask(16));
var mask = convertMask(9);
function convertMask(mask){
  cad = ""
  for(var i = 0; i<32; i++){
    if(i< mask){
      if(i%8==0){
        cad ="."+ cad;
      }
      cad = "1"+cad;
    }else {
      if(i%8==0){
        cad ="."+ cad;
      }
      cad = "0"+cad;
    }
  }
  return cad.split("").reverse().toString().replace(/,/g,"").replace(/./,"");
}
function converterIPBinary(ip){
  var ipsplit = ip.split(".");
  var ipresult = "";
  for(var i =0; i<ipsplit.length; i++){
    var binary = parseInt(ipsplit[i],10).toString(2);
    if(binary.length < 8){
      var aux ="";
      for(var j =0; j< (8-ipsplit.length); j++){
        aux += "0";
      }
      binary = aux + binary;
    }
    ipresult +=binary + ".";
  }
  //console.log(ipresult);
  return ipresult.substring(0,ipresult.length-1);
}
function converIp(ip, mask){
//  console.log(mask);
  var newip = [];
  var ipsplit = ip.split(".");
  var masksplit =mask.split(".");
//  var binarioip = parseInt(ipsplit[0],10).toString(2)+"."+parseInt(ipsplit[1],10).toString(2)+"."+parseInt(ipsplit[2],10).toString(2)+"."+parseInt(ipsplit[3],10).toString(2);
//  console.log(binarioip);
  //var binarioipsplit = binarioip.split(".")
  for(var i = 0 ; i<ipsplit.length; i++){
    auxip="";
    for(var j = 0; j<ipsplit[i].length; j++){
      auxip += ipsplit[i][j]& masksplit[i][j];
    }
    newip.push(auxip);
  }
  //console.log(mask);
  //console.log(ip);
  var result = newip.toString().replace(/,/g,".");
  var hack = result.split(".");
  var decimalIp = parseInt(hack[0],2)+ "."+parseInt(hack[1],2)+ "."+parseInt(hack[2],2)+ "."+parseInt(hack[3],2);
//  console.log(decimalIp);
  return{ipdec:decimalIp, ipbin:result, ipmask: mask} //objetos

  //console.log(newip.toString().replace(/,/g,"."));
}
//console.log(converterIPBinary("192.168.1.5"));
//converIp("192.168.1.5", mask);
console.log(converIp(converterIPBinary("192.168.1.5"), mask));


// SE LLAM A ESTE ARCHIVO CON node testip.js
