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