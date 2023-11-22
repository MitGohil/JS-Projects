const apiKey = "de875e9664c4cb49c08b83bad5e71079";
// const apiKey = "892094d71fbdaee329d134cd4482d369";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// const [
//   searchBox,
//   searchBtn,
//   weatherIcon,
//   citi,
//   temp,
//   humidity,
//   wind,
//   pressure,
// ] = document.querySelectorAll(
//   ".search input,  .search button,  .weather-icon,.city,.temp, .humidity,.wind,.pressure"
// );
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const citi = document.getElementsByClassName("city");
const temp = document.getElementsByClassName("temp");
const humidity = document.getElementsByClassName("humidity");
const pressure = document.getElementsByClassName("pressure");
const wind = document.getElementsByClassName("wind");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  var data = await response.json();
  console.log(data);

  citi[0].innerHTML = data.name;
  temp[0].innerHTML = Math.round(data.main.temp) + "°c";
  humidity[0].innerHTML = data.main.humidity + "%";
  pressure[0].innerHTML = data.main.pressure + " Pa";
  wind[0].innerHTML = data.wind.speed + " km/h";

  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "./img/clouds.png";
  } else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "./img/clear.png";
  } else if (data.weather[0].main == "Rain") {
    weatherIcon.src = "./img/rain.png";
  } else if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "./img/drizzle.png";
  } else if (data.weather[0].main == "Mist") {
    weatherIcon.src = "./img/mist.png";
  }
  document.querySelector(".weather").style.display = "block";
}
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
