const express = require("express");
const app = express();
const https = require("https"); //for accessing api of another server
const dotenv = require("dotenv");


dotenv.config();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const appid = process.env.APP_ID;
  const city = req.body.City;
  console.log(appid);
  const url = process.env.URL + city + "&units=metric&appid=" + appid;

  https.get(url, function(response) {//get method for making request by providing url & fetching response.

    response.on("data", function(data) {//we are using data from their api
      const weatherData = JSON.parse(data);//parsing json data into variable
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;

      res.write("<h1>The temperature in " + city + " is: " + temp + " degree Celcius.</h1>");
      res.write("<p>The weather condition is: " + weatherDescription + "</p>");
      const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<img src=" + iconUrl + ">");
      res.send();
    });
  });
});

app.listen(3000, function() {
  console.log("The server is running on port 3000");
});
