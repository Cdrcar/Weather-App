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



// Create list of searched cities
var searchHistoryList = function(cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    // City entry: create a <p> element with a "past-search" class and add City Name as text content
    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    // Container for City entry: create <div> element with a "past-search-container" class and append City entry to the Container
    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");
    searchEntryContainer.append(searchHistoryEntry);

    // Append Container for City to Search History Container Element
    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    // Add city name to array of savedSearches and setItem to Local Storage
      savedSearches.push(cityName);
      localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    if (savedSearches.length > 0){
    // Update savedSearches array with previously saved searches
        var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    // Reset search input
    $("#search-input").val("");
};