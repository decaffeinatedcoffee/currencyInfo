var express = require('express'); 
var app = express();
var cors = require('cors');
app.use(express.json());
app.use(cors()); 
var bodyParser = require('body-parser')
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

app.get("/", function(req, res){
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
//////////////////////////////////////////////////////////////////////////////////////////////

let days = [];
for(let i = 0; i <= 30; i++){
  var m = xValues[i].split("/")[0];
  var d = xValues[i].split("/")[1];
  var y = xValues[i].split("/")[2];
  if(d < 10){
    d = "0" + d;
  }
  if(m < 10){
    m = "0" + m;
  }
 y = y.replace(",","")
 y = y.replace(" ","")
  days.push(
    y + "-" + m + "-" + d
  )
}

console.log(xValues)
console.log(days)


   fetch("https://api.apilayer.com/exchangerates_data/timeseries?start_date=" + days[0] + "&end_date=" + days[30] + "&base=USD", requestOptions)
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
      res.render("index", {"days" : JSON.stringify(days), "history" : JSON.stringify(result), "eur" : eur.result.toFixed(2), "brl":brl.result.toFixed(2), "gbp":gbp.result.toFixed(2)})
      }catch{
          res.sendFile(__dirname + '/views/error.html');
      }
  })
  })
 })
    })  
})
  server.listen(process.env.PORT || 5000, () => {
    console.log("Listening Ports")
})
