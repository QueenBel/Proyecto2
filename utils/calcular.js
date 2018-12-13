var calcular = function(loadfood){
  this.foods = loadfood.foods || {};
  this.totalCantidad = loadfood.totalCantidad || 0;
  this.totalPrecio = loadfood.totalPrecio || 0;

  this.add = function(food, id){
    var storedFood = this.foods[id];
    if(!storedFood){
      storedFood = this.foods[id] = {food: food, cantidad: 0, price: 0};
    }
    storedFood.cantidad++;
    storedFood.price = storedFood.food.PrecioMen * storedFood.cantidad;
    this.totalCantidad++;
    this.totalPrecio+= storedFood.food.PrecioMen;
  };

  this.generateArray = function(){
    var array = [];
    for(var id in this.foods){
      array.push(this.foods[id]);
    }
    return array;
  };

  this.reduceOneFood = function(id){
    this.foods[id].cantidad--;
    this.foods[id].price -= this.foods[id].food.PrecioMen;
    this.totalCantidad--;
    this.totalPrecio -= this.foods[id].food.PrecioMen;
    if(this.foods[id].cantidad <= 0){
      delete this.foods[id];
    }
  };

  this.removeFoods = function(id){
    this.totalCantidad -= this.foods[id].cantidad;
    this.totalPrecio -= this.foods[id].price;
    delete this.foods[id];
  };

}

module.exports = calcular;
