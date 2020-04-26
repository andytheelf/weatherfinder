$(document).ready(() => {
    //local storage
    let pastCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    for (let i = pastCities.length - 1; i > 0; i--) {
        addButton(pastCities[i]);
    }

    if (pastCities[0] != null || pastCities[0] != undefined) {
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
                alert("Nope");
            }
        }).then(function(response) {
            weatherUpdate(response);
        });

        $.ajax({
            url: fiveDayUrl + cities + unitMeasure + "&" + apiKey,
            method: "GET",
            error: function() {
                console.log("NOPE");
            }
        }).then(function(extendResponse) {
            $("#extendedContainer").empty();
            for (let i = 4; i < extendResponse.list.length; i += 8) {
                $("#extendedContainer").append(
                    $("<div>")
                    .addClass("col card bg-info m-3 p-2")
                    .append(
                        $("<h4>").text(
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
                            extendResponse.list[i].main.temp + String.fromCharCode(177) + "F"
                        )
                    )
                    .append(
                        $("<p>").text(
                            "Humitdity: " + extendResponse.list[i].main.humidity
                        )
                    )
                );
            }
        });
    }

    function getUVIndex(lat, lon) {
        $.ajax({
            method: "GET",
            url: "https://api.openweathermap.org/data/2.5/uvi" +
                "?" +
                "appid=533ace453fe24f86c272d95fa98d9637" +
                "&lat=" +
                lat +
                "&lon=" +
                lon +
                "&mode=json",
            method: "GET",
            error: function() {
                alert("No Index available");
            }
        }).done(function(uvResponse) {
            $(".uv-intensity")
                .text(uvResponse.value)
                .css("color", "black")
                .css("F=font-weight: bold");
            let uvRange = [
                [0, 2.9],
                [3.1, 7],
                [8.0, 999]
            ];
            uvRange.forEach(element => {
                if (
                    uvResponse.value < Math.max(...element.slice(0, 3)) &&
                    uvResponse.value > Math.min(...element.slice(0, 3))
                ) {
                    $(".uv-intensity").css("background-color", element[2]);
                }
            });
        });
    }

    //update weather data 
    function weatherUpdate(data) {
        $("#forecastContainer").empty();
        $("#forecastContainer")
            .append(
                $("<h2>").text(data.name + " " + moment().format("MM/Do/YYYY"))
                .addClass("d-inline")
            )
            .append(
                $("<img>").attr(
                    "src",
                    "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
                )
            )
            .append(
                $("<p>").text(
                    "Temperature: " + data.main.temp + String.fromCharCode(176) + "F"
                )
            )
            .append(
                $("<p>").text(
                    "Humidity: " + data.main.humidity + String.fromCharCode(37)
                )
            )
            .append($("<p>").text("Wind Speed: " + data.wind.speed + " MPH"))
            .append(
                $("<p>")
                .text("UV Index: ")
                .append($("<span>").addClass("uv-intensity alert b-1"))
            );
        getUVIndex(data.coord.lat, data.coord.lon);
    };

    function addButton(newCity) {
        let cityButtons = $("#cityContainer").children().length;
        let newCities = [];
        $("#cityContainer")
            .children()
            .each((index, element) => {
                if (element.innerHTML == newCity) {
                    element.remove();
                }
            });

        let newButtons = $("<button>")
            .addClass("input-group-text bg-info w-100 pastButton")
            .text(newCity)
            .click(() => {
                getWeather(event.target.innerHTML);
                event.target.remove();
            });
        if (cityButtons < 8) {
            newButtons.prependTo($("#cityContainer"));
        } else {
            $("#cityContainer")
                .children()
                .last()
                .remove()
                .prepend(newButtons);
        }
        $("#cityContainer")
            .children()
            .each((index, element) => {
                newCities.push(element.innerHTML);
            });
        localStorage.setItem("savedCities", JSON.stringify(newCities));
    }

});