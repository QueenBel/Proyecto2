var numeroAleatorio=function(){
  var myArray = []
  var cantidadNumeros = 1000;
  while(myArray.length < cantidadNumeros ){
      var numeroAleatori = Math.round(Math.random() *(2000-1000+1)+1000);
    //var numeroAleatorio = Math.round(Math.random()*cantidadNumeros);
    var existe = false;
    for(var i=0;i<myArray.length;i++){
  	if(myArray [i] == numeroAleatorio){
          existe = true;
          break;
      }
    }
    if(!existe){
      myArray[myArray.length] = numeroAleatorio;
    }
  return numeroAleatori;
  };
//return myArray;
//console.log(myArray);
}

//console.log("números aleatorios : " + numeroAleatorio());

module.exports=numeroAleatorio;
