var express = require('express'); 
var app = express();
var cors = require('cors');
app.use(express.json());
app.use(cors()); 
require('dotenv').config();
app.set("view engine", "ejs");
const http = require('http');
let process = require('process');
const server = http.createServer(app);
const fetch = require('node-fetch');

var myHeaders = new fetch.Headers();
myHeaders.append("apikey", process.env.TOKEN);

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};


app.get('/', function (req, res) {
  var xValues = [ 
  ];
///////def from stackoverflow https://stackoverflow.com/questions/19910161/javascript-calculating-date-from-today-date-to-7-days-before////////////////////
timeFrom(31)
function timeFrom (X) {
    for (let I = 0; I < Math.abs(X); I++) {
        xValues.push(new Date(new Date().getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000)).toLocaleString());
    }
    
    for(let i = 0; i < xValues.length; i++){
        xValues[i] = xValues[i].slice(0, 10);
    }
    xValues.reverse();
}
   var startDate = "";
   startDate += xValues[0].slice(6, 10) + "-";
   startDate += xValues[0].slice(3, 5) + "-";
   startDate += xValues[0].slice(0, 2)
   var day1 = ""
   day1 += xValues[30].slice(6, 10) + "-";
   day1 += xValues[30].slice(3, 5) + "-";
   day1 += xValues[30].slice(0, 2)
   fetch("https://api.apilayer.com/exchangerates_data/timeseries?start_date=" + startDate + "&end_date=" + day1 + "&base=USD", requestOptions)
     .then(response => response.json())               
     .then(function(result){

     fetch("https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=USD&amount=1", requestOptions)
   .then(function (response) {
      return response.json();
    })
    .then(function(eur){ 
   fetch("https://api.apilayer.com/exchangerates_data/convert?to=BRL&from=USD&amount=1", requestOptions)
   .then(function (response) {
      return response.json();
    })
    .then(function(brl){ 
  fetch("https://api.apilayer.com/exchangerates_data/convert?to=GBP&from=USD&amount=1", requestOptions)
   .then(function (response) {
      return response.json();
    })
    .then(function(gbp){ 
      try{
      res.render("index", {"history" : JSON.stringify(result), "eur" : eur.result.toFixed(2), "brl":brl.result.toFixed(2), "gbp":gbp.result.toFixed(2)})
      }catch{
          res.sendFile(__dirname + '/views/error.html');
      }
  })
  })
 })
    })   
  });

  server.listen(process.env.PORT || 5000, () => {
    console.log("Listening Ports")
})
