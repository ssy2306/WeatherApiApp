const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const apiKey = require('./private/apikey');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', { weather: null, error: null });
});

app.post('/getWeather', function (req, res) {
    const citiesInput = req.body.cities;
  
    // Split the comma-separated input into an array
    console.log(citiesInput);
    const cities = citiesInput.split(",");

    const weatherData = {};
  
    const fetchWeather = (city) => {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
      request(url, function (err, response, body) {
        if (!err) {
          const weather = JSON.parse(body);
          if (weather.main !== undefined) {
            const weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
            weatherData[city] = weatherText;
          }
        }
        if (Object.keys(weatherData).length === cities.length) {
          res.json({ weather: weatherData });
        }
      });
    };
  
    cities.forEach((city) => {
      fetchWeather(city);
    });
  });
  

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
