const express = require('express')
const { requireAuth, roleAccess, checkUser} = require('./middleware/authMiddleware')
const fetch = require('node-fetch');
const Promise = require("promise");
const bodyParser = require('body-parser')
const db = require('./services/db')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send('Welcome.')
})

app.get('/users', checkUser, (req, res) => {
  const id = res.locals.id
    db.query(`SELECT id,nik,role,created_at,updated_at FROM users where id = ${id}`, []).then((results) => {

      res.send(results).status(200)
  
  }).catch(function(err){
  
    res.status(400).json({ error: err });
  
  });
})


function getRateCurrency() {
    return new Promise(function (resolve, reject) {
        fetch(`https://api.exchangerate.host/convert?from=USD&to=IDR`,{
        }).then(async (response) => {
            const data = await response.json();
            const priceRate = data.info.rate

            resolve(priceRate);
        })
    });
}

function getDataProduct() {
  return new Promise(function (resolve, reject) {
    fetch(`https://60c18de74f7e880017dbfd51.mockapi.io/api/v1/jabar-digital-services/product`, {
    }).then(async (response) => {
      const data = await response.json();
      const rateCurrency = await getRateCurrency()
      data.forEach(element => {
        element.price = element.price * rateCurrency
        element.price = `Rp.${element.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
      });

      resolve(data);
    });
});
}

app.get('/product', requireAuth, (req, res) => {
    const dataProduct = getDataProduct()
    dataProduct.then(function(result){
      res.send(result).status(200)
    })
})

app.get('/product-filters', requireAuth, roleAccess(["admin"]), (req, res) => {
    const dataProduct = getDataProduct()
    const filters = req.query;
    console.log(filters != '' || filters != undefined);
    dataProduct.then(function(result){
      if(filters != '' || filters != undefined){
        const filteredProduct = result.filter(item => {
            let isValid = true;
            for (key in filters) {
              console.log(key, item[key], filters[key]);
              isValid = isValid && item[key].toLowerCase() == filters[key].toLowerCase();
            }
            return isValid;
          });
        res.send(filteredProduct).status(200)  
      }else{
        res.send(result).status(200)
      }
    })
})

app.listen(3000)