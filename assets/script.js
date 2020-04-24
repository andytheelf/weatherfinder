const apiKey = '533ace453fe24f86c272d95fa98d9637';
function myFunction() {
    const citySearch = document.querySelector("#citySearch").value;
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&APPID=' + apiKey)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
    });
  }