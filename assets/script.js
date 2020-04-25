$(document).ready(() => {
    //local storage
    let pastCities =JSON.parse(localStorage.getItem("savedCities")) || [];
    for (let i = pastCities.length -1; i > 0; i--) {
        addButton(pastCities[i]);
    }

    if (pastCities[0] !=null || pastCities[0] != undefined) {
          getWeather(pastCities[0]);
    }

    // api call
    $("#cityButton").click(function(event) {
        event.preventDefault();

        if ($("#cityInput").val() != "") {
            getWeather(titleCaseConvert($("#cityInput").val()));
            $("#cityInput").val("");
        }
    });

    //weather input
    function getWeather(checkCity) {
        let forecastUrl = "https://api.openweathermap.org/data/2.5/weather";
        let fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast";
        let apiKey = "appid=533ace453fe24f86c272d95fa98d9637";
        let unitMeasure = "&units=Imperial";
        let cities = "?q=" + checkCity;

        $.ajax({
            url: forcastUrl + city + unitMeasure + "&" + apiKey + "&mode=json",
            method: "GET",
            success: function() {
                addButton(checkCity);
            },
            error: function() {
                alert("Information Unavailable");
            }
        }).then(function(response){
            weatherUpdate(response);
        });


    }
});