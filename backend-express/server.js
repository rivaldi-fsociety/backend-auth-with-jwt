const express = require('express')
const { requireAuth } = require('./middleware/authMiddleware')
const fetch = require('node-fetch');
const Promise = require("promise");

const app = express()

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


app.get('/product', requireAuth,(req, res) => {
    fetch(`https://60c18de74f7e880017dbfd51.mockapi.io/api/v1/jabar-digital-services/product`, {
    }).then(async (response) => {
      const filters = req.query;
      const data = await response.json();
      const rateCurrency = await getRateCurrency()
      data.forEach(element => {
        element.price = element.price * rateCurrency
        element.price = `Rp.${element.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
      });

      if(filters != '' || filters != undefined){
        const filteredProduct = data.filter(item => {
            let isValid = true;
            for (key in filters) {
              console.log(key, item[key], filters[key]);
              isValid = isValid && item[key].toLowerCase() == filters[key].toLowerCase();
            }
            return isValid;
          });
        res.send(filteredProduct).status(200)  
      }else{
        const product = JSON.stringify(data, null, 2)
        res.send(product).status(200)
      }
    })
})

app.get('/', (req, res) => {
    res.send('Welcome.')
})

app.listen(3000)