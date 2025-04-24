const defaultCity = "Hyderabad";
const geolocationTimeout = 10000;

window.onload = () => {

  if (navigator.geolocation) {
    const timeoutId = setTimeout(() => {
      console.log("User didn't respond to geolocation request, using default city.");
      getWeather(defaultCity);
    }, geolocationTimeout);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        clearTimeout(timeoutId);
        console.log("Location access denied or not available:", error);
        // If location is denied or unavailable, show default city
        getWeather(defaultCity);
      }
    );
  } else {
    console.log("Geolocation not supported by this browser.");
    getWeather(defaultCity);
  }
};


document.getElementById('searchBtn').addEventListener('click', () => {
  const city = searchInput.value.trim();
  const searchContainer = document.getElementById('search-container');

  if (city === '') {
    errorMsg.classList.remove('hidden');
    searchContainer.classList.add('border', 'border-red-500');

  } else {
    errorMsg.classList.add('hidden');
    searchContainer.classList.remove('border', 'border-red-500');

    getWeather(city);
  }
});
document.getElementById('locationBtn').addEventListener('click', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      await getWeatherByCoords(latitude, longitude);
    }, (error) => {
      console.error("Geolocation error:", error);
      alert("Could not get your location. Please allow location access.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});


const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const errorMsg = document.getElementById('errorMsg');
const searchContainer = document.getElementById('search-container');

searchBtn.addEventListener('click', () => {
  const city = searchInput.value.trim();

  if (city === '') {
    showError("Please enter a city name.");
    return;
  }

  getWeather(city);
});

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
  searchContainer.classList.add('border', 'border-red-500');
}

function hideError() {
  errorMsg.classList.add('hidden');
  searchContainer.classList.remove('border', 'border-red-500');
}

// Updated getWeather function with proper validation
async function getWeather(city) {
  try {
    hideError(); // Hide any previous errors

    const apiKey = '0b3af9d4eb462d4d1fbc0b1a75e429cd';

    // Fetch current weather data
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!weatherRes.ok) {
      throw new Error("City not found.");
    }

    const weatherData = await weatherRes.json();
    updateWeatherUI(weatherData);
    updateDateTime(weatherData);

    // Fetch 5-day / 3-hour forecast data
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!forecastRes.ok) {
      throw new Error("Failed to fetch forecast.");
    }

    const forecastData = await forecastRes.json();
    updateRecentCities(city);
    displayExtendedForecast(forecastData);

  } catch (error) {
    console.error(error);
    showError("Invalid city name. Please try again.");
  }
}

async function getWeatherByCoords(lat, lon) {
  const apiKey = '0b3af9d4eb462d4d1fbc0b1a75e429cd';

  try {
    // Fetch current weather
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const weatherData = await weatherRes.json();
    updateWeatherUI(weatherData);
    updateDateTime(weatherData);

    // Fetch forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();
    displayExtendedForecast(forecastData);

  } catch (error) {
    console.error("Error fetching weather by location:", error);
    alert("Failed to fetch weather data from location.");
  }
}




function updateWeatherUI(data) {
  console.log(`${data.name}, ${data.sys.country}`)
  const celsiusTemp = data.main.temp;
  const condition = data.weather[0].main;
  document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').textContent = `${celsiusTemp.toFixed(1)}°C`;
  document.getElementById('condition').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

  // Update weather icon
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById('weatherIcon').src = iconUrl;
  updateBackground(condition);
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
function displayExtendedForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  // Get today's date to compare and exclude today's forecast
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  const dailyData = {};
  data.list.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
    const time = entry.dt_txt.split(" ")[1];

    if (!dailyData[date] && date !== todayDate) {
      dailyData[date] = entry;
    }
  });

  // Convert the object to an array and take the first 5 entries
  const forecastArray = Object.values(dailyData).slice(0, 5);

  forecastArray.forEach(day => {
    const date = new Date(day.dt_txt);
    const formattedDate = date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });

    const icon = day.weather[0].icon;
    const temp = day.main.temp;
    console.log("temp", temp)
    const wind = day.wind.speed;
    const humidity = day.main.humidity;
    const desc = day.weather[0].description;

    forecastContainer.innerHTML += `
      <div class="bg-white/20 backdrop-blur-lg p-4 rounded-2xl shadow-md text-white text-center transition-transform duration-300 transform hover:scale-105 hover:bg-black/30">
        <h3 class="font-semibold">${formattedDate}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="mx-auto w-12 h-12" alt="${desc}" />
        <p class="text-lg">${temp.toFixed(1)}°C</p>
        <p class="text-sm">💨 ${wind} m/s</p>
        <p class="text-sm">💧${humidity}%</p>
      </div>
    `;
  });
}
function updateBackground(condition) {
  const body = document.body;
  let bgImage = "default.jpg"; // fallback

  const lowerCond = condition.toLowerCase();

  if (lowerCond.includes("clear")) {
    bgImage = "clear.jpg";
  } else if (lowerCond.includes("cloud")) {
    bgImage = "cloudy.jpeg";
  } else if (lowerCond.includes("rain") || lowerCond.includes("drizzle")) {
    bgImage = "rain.jpg";
  } else if (lowerCond.includes("thunder")) {
    bgImage = "thunder.jpg";
  } else if (lowerCond.includes("snow")) {
    bgImage = "snow.jpg";
  } else if (lowerCond.includes("mist") || lowerCond.includes("haze") || lowerCond.includes("fog")) {
    bgImage = "mist.jpg";
  }


  body.style.backgroundImage = `url('./assets/${bgImage}')`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundRepeat = "no-repeat";
}

// Handle dropdown toggle when clicking the button
document.getElementById('dropdownButton').addEventListener('click', (event) => {
  event.stopPropagation();  // Prevent event from bubbling up

  const dropdownMenu = document.getElementById('dropdownMenu');
  console.log('Button clicked. Toggling dropdown visibility...');

  // Ensure dropdown is rendered every time the button is clicked, even if cities are already there
  renderDropdown();  // Update the dropdown items every time the button is clicked

  // Toggle visibility of the dropdown menu
  dropdownMenu.classList.toggle('hidden');  // This will add or remove the 'hidden' class

  // Log the updated state after toggle
  console.log('Dropdown visibility now:', dropdownMenu.classList.contains('hidden') ? 'Hidden' : 'Visible');
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  const dropdownMenu = document.getElementById('dropdownMenu');
  const dropdownButton = document.getElementById('dropdownButton');

  console.log('Document clicked. Checking if outside dropdown...');

  if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
    console.log('Clicked outside. Hiding dropdown...');
    dropdownMenu.classList.add('hidden');  // Close dropdown if clicked outside
  }
});

// Render the dropdown items based on recent cities stored in localStorage
function renderDropdown() {
  const dropdownMenu = document.getElementById('dropdownMenu');
  const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

  console.log('Rendering dropdown with recent cities:', recentCities);

  // Clear existing dropdown items
  dropdownMenu.innerHTML = '';

  // If there are no recent cities, don't show dropdown
  if (recentCities.length === 0) {
    dropdownMenu.innerHTML = '<li class="px-4 py-2 text-sm text-gray-300">No recent searches yet</li>';
    console.log('No recent cities found. Hiding dropdown...');
    // dropdownMenu.classList.add('hidden');
    return;
  }

  // Create a list item for each recent city
  recentCities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.classList.add('px-4', 'py-2', 'hover:bg-black/40', 'cursor-pointer');
    listItem.textContent = city;

    // When a city is selected, get the weather and hide the dropdown
    listItem.addEventListener('click', () => {
      console.log('City selected:', city);
      getWeather(city);
      dropdownMenu.classList.add('hidden');  // Hide dropdown when city is selected
    });

    dropdownMenu.appendChild(listItem);
  });
}
function updateRecentCities(city) {
  console.log('Updating recent cities with:', city);

  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  console.log('Current cities in localStorage:', recentCities);

  city = city.trim();  // Remove any extra spaces

  // Check if the city already exists in the recent cities list
  if (!recentCities.some(c => c.toLowerCase() === city.toLowerCase())) {
    recentCities.unshift(city);  // Add the city to the beginning of the list

    // Limit the list to 5 cities
    if (recentCities.length > 5) {
      recentCities.pop();  // Remove the last city if there are more than 5
    }

    localStorage.setItem('recentCities', JSON.stringify(recentCities));  // Store updated list in localStorage
    console.log('Cities after update:', recentCities);

    // Re-render the dropdown
    renderDropdown();
  }
}
