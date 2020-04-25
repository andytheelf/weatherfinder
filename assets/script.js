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
            getWeather(($("#cityInput").val()));
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
            url: forecastUrl + cities + unitMeasure + "&" + apiKey + "&mode=json",
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

        $.ajax({
            url: fiveDayUrl + cities + unitMeasure + "&" + apiKey,
            method: "GET",
            error: function() {
                console.log("Unavailable");
            }
        }).then(function(extendResponse) {
            $("#forecastContainer").append(
                $("<div>")
                .addClass("col vard bg-primary m-2 p-2")
                .append(
                    $("<h3>").text(
                        moment.unix(extendResponse.list[i].dt).format("M/DD/YYYY")

                    )
                )
                .append(
                    $("<img>").attr(
                        "src",
                        "https://openweathermap.org/img/wn/" +
                        extendResponse.list[i].weather[0].icon + ".png"
                    )
                )
                .append(
                    $("<p>").text(
                        "Temp: " + 
                        extendResponse.list[i].main.temp + String.fromCharCode(176) + "F"
                    )
                )
                .append(
                    $("<p>").text(
                        "Humitdity: " + extendResponse.list[i].main.humidity
                    )
                )
            );
        })
    }

    
});