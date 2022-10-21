const express = require('express');
const validItemOrFalse = require('./validator.js');
const app = express();

const phones = [
    {id: 1, brand: 'Samsung', model: 'S10E', price: 50000, sim: 2, condition: 'new'},
    {id: 2, brand: 'Apple', model: 'Iphone_14', price: 60000, sim: 1, condition: 'used'}
    ]

const laptops = [
    {id: 1, brand: 'HP', model: 'Pavilion', price: 70000, diagonal: 15.6, condition: 'broken'},
    {id: 2, brand: 'Apple', model:' MacBook Air', price: 80000, diagonal: 14, condition: 'new'}
];

const allGoods = {phones,laptops};

app.use(express.urlencoded({ extended:false }));

function addNewItem(newItem,category){
    const probableItem = validItemOrFalse(newItem,category);
    if(probableItem){
        probableItem.id = Object.keys(allGoods[category]).length + 1;
        allGoods[category].push(probableItem);
        return true;
    } return false;
}

function patchItem(updatedItem,category){
    let truthyFields = true;
    Object.keys(updatedItem).forEach(value => {
        if(!value){
            truthyFields = false;
        }
    })
    if(updatedItem.id && truthyFields){
        updatedItem.id = Number(updatedItem.id);
        const currentCategory = allGoods[category];
        const indexToPatch = currentCategory.findIndex(el => el.id === updatedItem.id);
        if(indexToPatch < 0){
            return false;
        }

        Object.keys(updatedItem).forEach(key =>{
            if(currentCategory[indexToPatch][key]){ //если такое поле есть вообще, то обновляем
               currentCategory[indexToPatch][key] = updatedItem[key];
            }
        })
        return true
    } return false;
}

app.get('/', (req, res)=>{
    res.status(200);
    res.end(JSON.stringify(allGoods));
})

app.get('/:category',(req,res) => {
  const category = req.params.category;
  if(allGoods[category]) {
      res.status(200);
      res.end(JSON.stringify(allGoods[category]));
      //return;
  } else {
      res.status(404);
      res.end('Ошибка в адресе (нет такой категории): ' + category);
  }
})

app.post('/:category',(req,res) => {
   const category = req.params.category;
   if(!allGoods[category]) {
      res.status(404);
      res.end('Ошибка в адресе (нет такой категории): ' + category);
      return;
   }
   //console.log(req.body)
   const newItem = {...req.body};
   if(addNewItem(newItem,category)){
       res.status(201);
       res.end(JSON.stringify(allGoods[category]));
       //return;
   } else {
       res.status(400);
       res.end("Ошибка при добавлении предмета. Переданы некорректные данные");
   }
})

app.patch('/:category', (req,res) => {
    const category = req.params.category
    if(!allGoods[category]) {
        res.status(404);
        res.end('Ошибка в адресе (нет такой категории): ' + category);
        return;
    }
    const updatedItem = req.body;

    if(patchItem(updatedItem, category)){
        res.status(200);
        res.end(JSON.stringify(allGoods[category]));
    } else {
        res.status(400);
        res.end('Ошибка при обновлении предмета');
    }
})

app.delete('/:category', function(req, res) {
    const category = req.params.category;
    const id = Number(req.body.id);

    let currentCategory = allGoods[category];
    if(!currentCategory){
        res.status(404);
        res.end('Ошибка в адресе (нет такой категории): ' + category);
        return;
    }
    currentCategory = currentCategory.filter(item => item.id !== id);

    allGoods[category] = currentCategory;
    res.status(200);
    res.end(JSON.stringify(allGoods[category]));
})

app.listen(8080,()=> console.log('listening on'));