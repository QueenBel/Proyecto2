var calsubnet = function(current_octeto, ipgenerator, octeto){

    if(current_octeto % 256 == 0){
      var ant_octeto = parseInt(ipgenerator[octeto-1], 10);
      ant_octeto++;
      if(ant_octeto % 256 == 0){
        var ant_octeto2 = parseInt(ipgenerator[octeto-2], 10);
        ant_octeto2++;
        if(ant_octeto2 % 256 == 0){
          var ant_octeto3 = parseInt(ipgenerator[octeto-3], 10);
          ant_octeto3++;
          ipgenerator[octeto-3] = ant_octeto3;
        }else {
          ipgenerator[octeto-2] = ant_octeto2;
          var ant_octeto = parseInt(ipgenerator[octeto-1], 10);
          ant_octeto = 0 ;
          ipgenerator[octeto-1] = ant_octeto;
        }

      }else {
        ipgenerator[octeto-1] = ant_octeto;
        var ant_octeto = parseInt(ipgenerator[octeto], 10);
        ant_octeto = 0;
        ipgenerator[octeto] = ant_octeto;
      //  console.log("---------");
        //console.log(ipgenerator);
      }
    }else{
      ipgenerator[octeto] = current_octeto;
    }
    return ipgenerator;
}
// ME QUDE EN EL 2:03:00 del vid
module.exports = calsubnet;
//SE LO PUEDOE HACER CON function recursiva
