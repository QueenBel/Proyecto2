var calcular = function(loadfood){
  this.foods = loadfood.foods || {};
  this.totalQuantity = loadfood.totalQuantity || 0;
  this.totalPrice = loadfood.totalPrice || 0;

  this.add = function(food, id){
    var storedFood = this.foods[id];
    if(!storedFood){
      storedFood = this.foods[id] = {food: food, quantity: 0, price: 0};
    }
    storedFood.quantity++;
    storedFood.price = storedFood.food.PrecioMen * storedFood.quantity;
    this.totalQuantity++;
    this.totalPrice+= storedFood.food.PrecioMen;
  };

  this.generateArray = function(){
    var array = [];
    for(var id in this.foods){
      array.push(this.foods[id]);
    }
    return array;
  };

  this.reduceOneFood = function(id){
    this.foods[id].quantity--;
    this.foods[id].price -= this.foods[id].food.PrecioMen;
    this.totalQuantity--;
    this.totalPrice -= this.foods[id].food.PrecioMen;
    if(this.foods[id].quantity <= 0){
      delete this.foods[id];
    }
  };

  this.removeFoods = function(id){
    this.totalQuantity -= this.foods[id].quantity;
    this.totalPrice -= this.foods[id].price;
    delete this.foods[id];
  };

}

module.exports = calcular;
