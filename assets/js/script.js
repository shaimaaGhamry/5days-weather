"use strict"
var inputCityElem = $("#inputCityId");
var searchBtnElem = $("#searchBtnId");

var currentWeatherElem = $("#currentWeatherContainerId");
var nextWeatherElem = $("#fiveDaysWeatherContainerId");

const APIKey = "44efa20749c98308accb83f12256fd4d";


class WeatherInfo {
    constructor(city, coord, date, temp, humidity, wind, symbol) {
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

function init() {
    retrieveFavCities();
    searchBtnElem.on("click", function () {
        handleSearchAction($(this));
    });
}

function handleSearchAction(SearchButton) {
    var inputCityName = inputCityElem.val();

    displayWeatherInfo(inputCityName);
    saveCityAsFav(inputCityName);
}

function saveCityAsFav(cityName){
    if(localStorage.getItem("FAV") == null){
        localStorage.setItem("FAV", cityName);       
    }else{
        var favCityList = localStorage.getItem("FAV") ;
       if(!favCityList.includes(cityName)){
        localStorage.setItem("FAV", favCityList + "," + cityName);        
       }
        
    }   

    retrieveFavCities();
}


function retrieveFavCities(){
    if(localStorage.getItem("FAV") ==null){
        return;
    } 

   $("#FavListId").remove();

    var favList = localStorage.getItem("FAV").split(",");

    var favListContainer = $("<div>");
    favListContainer.attr("id", "FavListId")
    favListContainer.addClass("weatherCard");

    for(var i =0; i< favList.length; i++){
        var ButtonElem = $("<button>");
        ButtonElem.text(favList[i]);
        ButtonElem.on("click", function () {
            console.log("add Evenet Listener");
            console.log($(this));
            inputCityElem.val($(this).text());
            handleSearchAction($(this));
        });

        favListContainer.append(ButtonElem);
    }

    $("aside").append(favListContainer);
}

function displayWeatherInfo(city) {

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            var weatherInfo = new WeatherInfo(
                city,
                data["coord"],
                data["dt"],
                data["main"]["temp"],
                data["main"]["humidity"],
                data["wind"]["speed"],
                data["weather"][0]["icon"]);

            displayCurrentWeather(weatherInfo);
            display5daysForcasting(weatherInfo);


        });
}

function display5daysForcasting(weatherInfo) {
    console.log("inside get 5 days weather");
    var lon = weatherInfo.coord["lon"];
    var lat = weatherInfo.coord["lat"];

    var reqURL = "http://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    fetch(reqURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            nextWeatherElem.empty();
            console.log(data);
            for (var i = 7; i < data["list"].length; i += 8) {
               

                console.log("for each weather");
                //create container div
                var weatherCard = $("<div>");
                weatherCard.addClass("weatherCard");

                var dateElem = $("<h7>");
                var date = new Date(data["list"][i]["dt"] * 1000);
                dateElem.text(date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
                weatherCard.append(dateElem);

                var tempElem = $("<h7>");
                var temp = data["list"][i]["main"]["temp"];
                tempElem.text("Temperature: " + temp + " F");
                weatherCard.append(tempElem);


                var humidityElem = $("<h7>");
                var humidity = data["list"][i]["main"]["humidity"];
                humidityElem.text("Humidity: " + humidity + " MDF");
                weatherCard.append(humidityElem);


                var windElem = $("<h7>");
                var wind = data["list"][i]["wind"]["speed"];
                windElem.text("Wind: " + wind + " %");
                weatherCard.append(windElem);

                console.log(weatherCard);

                nextWeatherElem.append(weatherCard);

            }
        });




}

function displayCurrentWeather(weatherInfo) {

    console.log(weatherInfo);
    currentWeatherElem.empty();

    var weatherCard = $("<div>");
    weatherCard.addClass("weatherCard");

    //create Element for the city name and the date
    var date = new Date(weatherInfo.date * 1000);
    var dateElem = $("<h4>");
    dateElem.text(weatherInfo.city + " ( " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " )");
    weatherCard.append(dateElem);

    var tempElem = $("<h5>");
    tempElem.text("Temp: " + weatherInfo.temperature + " F");
    weatherCard.append(tempElem);

    var humidityElem = $("<h5>");
    humidityElem.text("Humidty: " + weatherInfo.humidity + " MPH");
    weatherCard.append(humidityElem);

    var windElem = $("<h5>");
    windElem.text("Temp: " + weatherInfo.wind + " %");
    weatherCard.append(windElem);

    currentWeatherElem.append(weatherCard);
}

