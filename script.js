
document.getElementById('searchBtn').addEventListener('click', () => {
  const city = searchInput.value.trim();
  if (city !== '') {
    getWeather(city);
  }
});
async function getWeather(city) {
  const apiKey = '0b3af9d4eb462d4d1fbc0b1a75e429cd';
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
  const data = await res.json();
  console.log("data", data)
  updateWeatherUI(data);
  updateDateTime(data);
  // updateBackground(data.weather[0].main); 
}
function updateWeatherUI(data) {
  console.log(`${data.name}, ${data.sys.country}`)
  const celsiusTemp = Math.round(data.main.temp - 273.15);
  document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').textContent = `${celsiusTemp}°C`;
  document.getElementById('condition').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

  // Update weather icon
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById('weatherIcon').src = iconUrl;
}
function updateDateTime(data) {
  const now = new Date(data.dt * 1000); // Convert Unix timestamp to milliseconds
  console.log("now", now)

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const day = days[now.getDay()];
  console.log("day", day)
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Format time to show as HH:MM:SS
  const time = `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

  // Update the DOM with date and time
  document.getElementById('day').textContent = `${day}`;
  document.getElementById('currentDate').textContent = `${month} ${date}, ${year}`;
  document.getElementById('currentTime').textContent = `Time: ${time}`;
}


