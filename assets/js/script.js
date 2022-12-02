"use strict"
var inputCityElem = $("#inputCityId");
var searchBtnElem = $("#searchBtnId");

var currentWeatherElem = $("#currentWeatherContainerId");
var nextWeatherElem = $("#fiveDaysWeatherContainerId");

const APIKey = "44efa20749c98308accb83f12256fd4d";


class WeatherInfo{
    constructor(city, coord, date, temp, humidity, wind, symbol){
    this.city = city;
    this.coord = coord;
    this.date = date;
    this.temperature = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.symbol = symbol;
    }
}

init();

function init(){
    searchBtnElem.on("click", function(){
        handleSearchAction($(this));
    });
}

function handleSearchAction(SearchButton){
    var inputCityName = inputCityElem.val();
   
    getWeatherInfo(inputCityName);
}

function getWeatherInfo(city){

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
   
    fetch(queryURL)
    .then(function(response){
            return response.json();
        })
    .then(function(data){

        var weatherInfo = new WeatherInfo(
            city, 
            data["coord"],
            data["dt"], 
            data["main"]["temp"],
            data["main"]["humidity"],
            data["wind"]["speed"],
            data["weather"][0]["icon"] );

        var fiveDaysWeatherList = get5daysWeather(weatherInfo);
        displayCurrentWeather(weatherInfo);
        displayFiveDaysWeather(fiveDaysWeatherList);
               
    });

    function get5daysWeather(weatherInfo){
        let fiveDaysWeatherList = [];
        var lon = weatherInfo.coord["lon"];
        var lat =  weatherInfo.coord["lat"];
        var reqURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=5"

        fetch(reqURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            
          for (var i = 0; i < data["list"].length; i++) {
            let nextWeather = new WeatherInfo(weatherInfo.city, weatherInfo.coord, 
                data["list"][i]["dt"],
                data["list"][i]["main"]["temp"],
                data["list"][i]["main"]["humidity"],
                data["list"][i]["wind"]["speed"],
                data["list"][i]["weather"][0]["icon"]
                );
            fiveDaysWeatherList.push(nextWeather);

          }
        });
         return fiveDaysWeatherList;

    }

    function displayCurrentWeather(weatherInfo){

        console.log(weatherInfo);

        //create Element for the city name and the date
        currentWeatherElem.children("h1").text(weatherInfo.city + " ( " + new Date(weatherInfo.date * 1000) + " )");
        
        var tempElem = $("<h4>");
        tempElem.text("Temp: " + weatherInfo.temperature + " F");
        currentWeatherElem.append(tempElem);

        var humidityElem = $("<h4>");
        humidityElem.text("Humidty: " + weatherInfo.humidity + " MPH");
        currentWeatherElem.append(humidityElem);

        var windElem = $("<h4>");
        windElem.text("Temp: " + weatherInfo.wind + " %");
        currentWeatherElem.append(windElem);
    }

    function displayFiveDaysWeather(fiveDaysWeatherList){
        console.log("inside the display five function")

        // var weatherArr = JSON.parse(fiveDaysWeatherList);
        // for(var i = 0; i<weatherArr.length; i++){
        //     console.log(weatherArr[i]);
        // }

        fiveDaysWeatherList.forEach(element => {

            
        });
    }
    
}