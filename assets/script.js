// Variables
var apiKey = "1b18ce13c84e21faafb19c931bb29331";
var savedSearches = [];


//Event listener when click on the button from the search form 
$(".btn").on("click", function(event) {
    event.preventDefault();
    
    // Get city searched

    var cityName = $("#search-input").val();

    //If no city entered, send alert to enter a name of city

    if (cityName === "" || cityName == null) {
        //send alert if search input is empty when submitted
        alert("Please enter name of city.");
        event.preventDefault();
    } else {
        // If cityName is true (valid), display its current weather conditions and the forecast weather and the cityName it will be added to the search history list
        currentWeatherSection(cityName);
        fiveDayForecastSection(cityName);
    }
});



// Add searched cities to a seachHistoryList and store it in the the browser's local storage
var searchHistoryList = function(cityName) {

    // City entry: create a <p> element with a "past-search" class and add City Name as text content
    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    // Remove any existing search history entries that contain the current cityName. This ensures that there are no duplicate entries in the search history list
    $('.past-search:contains("' + cityName + '")').remove();

    // Container for City entry: create <div> element with a "past-search-container" class and append City entry to the Container
    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");
    searchEntryContainer.append(searchHistoryEntry);

    // Append Container for City to Search History Container Element
    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    // The current cityName is pushed onto the savedSearches array, and the updated array is stored in local storage
      savedSearches.push(cityName);
      localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    //Checks if there are any saved searches in local storage
    if (savedSearches.length > 0){
    // If there are saved searches, parse them from a JSON string back into an array
        var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    // Clear search input field
    $("#search-input").val("");
};




// Load saved search history entries from local storage and display it to the search history container
var loadSearchHistory = function() {
    // Get from local storage saved search history and assign it to the savedSearchHistory variable
    var savedSearchHistory = localStorage.getItem("savedSearches");

    // If there is no previous saved searches, return false (no search history data to display)
    if (!savedSearchHistory) {
        return false;
    }

    // Convert saved search history string into array
    savedSearchHistory = JSON.parse(savedSearchHistory);

    // For loop savedSearchHistory array and make entry for each item in the list
    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};




//Display current weather data for the given city
var currentWeatherSection = function(cityName) {

    // Call to OpenWeather API to get current weather data for the specified city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)

        
        .then(function(response) {
            console.log(response);
            // Convert response in a JavaScript object
            return response.json();
        })

        .then(function(response) {
            // Obtain city's longitude and latitude to use them in the next call API call Open Weather
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;
            
            //Another API call to the OpenWeather API using the onecall endpoint to get additional weather data for the city
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                // Convert response in a JavaScript object
                .then(function(response) {
                    console.log(response);
                    return response.json();
                })
                //Call the searchHistoryList to add searched city to the list of past searches
                .then(function(response){
                    searchHistoryList(cityName);

                    // Weather data from response applied to the current weather section
                    
                    // Add style to Weather Container adding a class to the div with the id of #current-weather-container
                    var currentWeatherContainer = $("#current-weather-container");
                    currentWeatherContainer.addClass("current-weather-container");

                    // Title: Add City name, Date and Weather Icon to current weather section
                    var currentCity = $("#current-city");
                    var currentDay = moment().format("ddd D MMMM YYYY");
                    currentCity.text(`${cityName} (${currentDay})`);
                    var currentIcon = $("#current-weather-icon");
                    currentIcon.addClass("current-weather-icon");
                    var currentIconCode = response.current.weather[0].icon;
                    currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);


                    //Update the current weather section with the data from the parsed JSON - Create Variables for Weather Conditions and add text content
                    
                    // Temperature
                    var currentTemperature = $("#current-temperature");
                    currentTemperature.text("Temperature: " + response.current.temp + " \u00B0F");

                    // Humidity
                    var currentHumidity = $("#current-humidity");
                    currentHumidity.text("Humidity: " + response.current.humidity + "%");

                    // Wind
                    var currentWindSpeed = $("#current-wind-speed");
                    currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + " MPH");

                    // UV index
                    var currentUvIndex = $("#current-uv-index");
                    currentUvIndex.text("UV Index: ");
                    var currentNumber = $("#current-number");
                    currentNumber.text(response.current.uvi);

                    // Background color to current uv index number according to good, medium or critical
                    if (response.current.uvi <= 2) {
                        currentNumber.addClass("good");
                    } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
                        currentNumber.addClass("medium");
                    } else {
                        currentNumber.addClass("critical");
                    }
                })
        })

        //Use .catch method to handle errors that may occur in fetch requests
        .catch(function(err) {
            // Reset search input so in case of an error user can enter a new search term
            $("#search-input").val("");

            // Display alert to inform user that there was an error
            alert("We could not find the city you searched for. Try searching for a valid city.");
        });
};




var fiveDayForecastSection = function(cityName) {
    // Call to OpenWeather API to get current weather data for the specified city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        // Convert response in a JavaScript object
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data)
            // Obtain city's longitude and latitude to use them in the next call API call Open Weather
            var cityLon = data.coord.lon;
            var cityLat = data.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                // Get response from one call api and turn it into objects
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response);

                    // Forecast title for the next 5 days
                    var futureForecastTitle = $("#future-forecast-title");
                    futureForecastTitle.text("Forecast for the next 5 days:")

                    // Using data from response, set up each day of 5 day forecast
                    for (var i = 1; i <= 5; i++) {
                        // console.log(response.daily[i])
                        // Add class to future cards to create card containers
                        var futureCard = $(".future-card");
                        futureCard.addClass("future-card-style");

                        // Add date to 5 day forecast
                        var futureDate = $("#future-date-" + i);
                        date = moment().add(i, "d").format("DD/MM/YY");
                        futureDate.text(date);

                        // Add icon to 5 day forecast
                        var futureIcon = $("#future-icon-" + i);
                        futureIcon.addClass("future-icon");
                        var futureIconCode = response.daily[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

                        // Add temp to 5 day forecast
                        var futureTemp = $("#future-temp-" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

                        // Add humidity to 5 day forecast
                        var futureHumidity = $("#future-humidity-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                })
        })
};



// Called when a search history entry is clicked
$("#search-history-container").on("click", "p", function() {
    // get text (city name) of entry and pass it as a parameter to display weather conditions
    var previousCityName = $(this).text();
    currentWeatherSection(previousCityName);
    fiveDayForecastSection(previousCityName);

    //
    var previousCityClicked = $(this);
    previousCityClicked.remove();
});

loadSearchHistory();
