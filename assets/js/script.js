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
    inputCityElem.val("");
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
    
    var queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`;
    
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            var cityInfo= {
                city: city,
                lat:data[0].lat,
                lon:data[0].lon
            }
            
            
            console.log(cityInfo);
                
            display5daysForcasting(cityInfo);


        });
}

function display5daysForcasting(cityInfo) {
    console.log("inside get 5 days weather");
    var lon = cityInfo.lon;
    var lat = cityInfo.lat;

    var reqURL = "https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    
    fetch(reqURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            nextWeatherElem.empty();
            console.log(data);

            //display the current weather
            var weatherInfo = {
                iconCode: data["list"][0]["weather"][0]["icon"],
                city: data.city.name,
                dt: data["list"][0]["dt"],
                temp: data["list"][0]["main"]["temp"],
                humidity: data["list"][0]["main"]["humidity"],
                windSpeed: data["list"][0]["wind"]["speed"],
                weatherIcon: data["list"][0]["weather"][0]["icon"]
            };
            displayCurrentWeather(weatherInfo);

            for (var i = 9; i <data.list.length; i+=8) {
               

                console.log("for each weather");
                //create container div
                var weatherCard = $("<div>");
                weatherCard.addClass("weatherCard");

                var dateElem = $("<h6>");
                var date = new Date(data["list"][i]["dt_txt"] );
                dateElem.text(date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
                weatherCard.append(dateElem);

                var iconCode = data["list"][i]["weather"][0]["icon"];
                console.log("ICON: "+ iconCode);
                
                var iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
                var weatherIcon = $("<img>").attr({
                    src:iconUrl,
                    width:"30px",
                    height:"30px"
        
                });
                weatherCard.append(weatherIcon);
                
                var tempElem = $("<h7>");
                var temp = data["list"][i]["main"]["temp"];
                tempElem.text("Temperature: " + temp + " \u00B0 F");
                weatherCard.append(tempElem);


                var humidityElem = $("<h7>");
                var humidity = data["list"][i]["main"]["humidity"];
                humidityElem.text("Humidity: " + humidity + " %");
                weatherCard.append(humidityElem);


                var windElem = $("<h7>");
                var wind = data["list"][i]["wind"]["speed"];
                windElem.text("Wind: " + wind + " MPH");
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
    var date = new Date(weatherInfo.dt * 1000);
    var dateElem = $("<h6>");
    dateElem.text(weatherInfo.city + " ( " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " )");
    weatherCard.append(dateElem);

    var iconUrl = `https://openweathermap.org/img/wn/${weatherInfo.iconCode}@4x.png`;
    var weatherIcon = $("<img>").attr({
        src:iconUrl,
        width:"30px",
        height:"30px"

    });
    weatherCard.append(weatherIcon);

    var tempElem = $("<h5>");
    tempElem.text("Temp: " + weatherInfo.temp + " \u00B0F");
    weatherCard.append(tempElem);

    var humidityElem = $("<h5>");
    humidityElem.text("Humidty: " + weatherInfo.humidity + " %");
    weatherCard.append(humidityElem);

    var windElem = $("<h5>");
    windElem.text("Wind: " + weatherInfo.windSpeed + " MPH");
    weatherCard.append(windElem);

    currentWeatherElem.append(weatherCard);
}

