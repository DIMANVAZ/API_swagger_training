const express = require('express');
const isItemValid = require('./validator.js');
const app = express();

const phones = {'1':{brand: 'Samsung', model: 'S10E',price: 50000,sim: 2},
                '2':{brand: 'Apple', model: 'Iphone_14',price: 60000,sim: 1}};
const laptops = {'1':{brand: 'HP', model: 'Pavilion', price: 70000, diagonal: 15.6},
                 '2':{brand: 'Apple', model:' MacBook Air', price: 80000, diagonal: 14}};
const allGoods = {phones,laptops};

app.use(express.urlencoded({ extended:false }));

function addNewItem(newItem,category){
    if(isItemValid(newItem,category)){
        const counter = Object.keys(allGoods[category]).length + 1;
        allGoods[category][counter] = newItem;
        return true;
    } return false;
}

app.get('/:category',(req,res) => {
  const category = req.params.category;
  if(allGoods[category]) {
      res.status(200);
      res.end(JSON.stringify(allGoods[category]));
      return;
  } else {
      res.status(404);
      res.end('No such category: ' + category);
  }
})

app.post('/:category',(req,res) => {
   const category = req.params.category;
   if(!allGoods[category]) {
      res.status(404);
      res.end('No such category: ' + category);
      return;
   }
   //console.log(req.body)
   const newItem = {...req.body};
   if(addNewItem(newItem,category)){
       res.status(201);
       res.end(JSON.stringify(allGoods[category]));
       return;
   } else {
       res.status(400);
       res.end("Something wrong with POST data")
   }
})

app.listen(8080,()=> console.log('listening on'));