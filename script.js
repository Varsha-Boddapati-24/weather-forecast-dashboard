const defaultCity = "Hyderabad";

// Function to execute when the page loads it shows default location
// Tries to get the user's location. If permission is denied, defaults to a pre-defined city (Hyderabad).
window.onload = () => {

  getWeather(defaultCity,true);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.log("Location access denied or not available:", error);
        // If location is denied or unavailable, show default city
        getWeather(defaultCity,true);
      }
    );
  } else {
    console.log("Geolocation not supported by this browser.");
    getWeather(defaultCity,true);
   }
 
};


const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const errorMsg = document.getElementById('errorMsg');
const searchContainer = document.getElementById('search-container');
const locationBtn = document.getElementById('locationBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownButton = document.getElementById('dropdownButton');

// Listens for a click on the search button, validates the city input, and either shows an error or fetches weather data for the entered city.
searchBtn.addEventListener('click', () => {
  const city = searchInput.value.trim();

  if (city === '') {
    showError("Please enter a city name.");
    return;
  }
  else if (!isValidCity(city)) {
    showError("City name must contain only letters and spaces.");
    return;
  } else {
    getWeather(city);
  }
});
// Listens for the "Enter" key press in the search input, validates the city input, and either shows an error or fetches weather data for the entered city.
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city === '') {
      showError("Please enter a city name.");
    } else if (!isValidCity(city)) {
      showError("City name must contain only letters and spaces.");
    } else {
      getWeather(city);
    }
  }
});
// Listens for a click event on the location button, attempts to fetch the user's geolocation, and either fetches weather data based on the location or shows an error if geolocation fails.
locationBtn.addEventListener('click', () => {
  hideError(); // Clear any old messages
  searchInput.value = "";

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);

        let message = "Could not get your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access was denied. Please allow it to use this feature.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location unavailable. Try again later.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out.";
        }

        showError(message, true);
      }
    );
  } else {
    showError("Geolocation is not supported by your browser.", true);
  }
});

// Displays an error message and applies different styles to indicate whether the error is related to geolocation or search input.
function showError(message, isGeoLocationError = false) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');

  if (isGeoLocationError) {
    searchContainer.classList.remove('border', 'border-red-500');
    locationBtn.classList.add('border', 'border-red-500');
  } else {
    locationBtn.classList.remove('border', 'border-red-500');
    searchContainer.classList.add('border', 'border-red-500');
  }
}

// Hides the error message and resets the styles on the search container and location button.
function hideError() {
  errorMsg.classList.add('hidden');
  errorMsg.classList.remove('text-left', 'text-right');

  searchContainer.classList.remove('border', 'border-red-500');
  locationBtn.classList.remove('border', 'border-red-500');
}

// Validates if the input city name contains only letters and spaces.

function isValidCity(input) {
  const trimmed = input.trim();
  const cityRegex = /^[a-zA-Z\s]+$/; 
  return trimmed.length > 0 && cityRegex.test(trimmed);
}

// Fetches current weather and 5-day forecast for a given city, updates the UI, and handles errors like invalid city or offline status.

async function getWeather(city,isDefault=false) {
  try {
    hideError(); // Hide any previous errors

    const apiKey = '0b3af9d4eb462d4d1fbc0b1a75e429cd';

    // Fetch current weather data
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!weatherRes.ok) {
      if (weatherRes.status === 404) {
        throw new Error("invalid city. Please try again.");
      } else {
        throw new Error("Failed to fetch weather data.");
      }
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
    if(isDefault){
      renderDropdown();
    }
    else{
      updateRecentCities(city);
    }

    displayExtendedForecast(forecastData);

  } catch (error) {
    console.error(error);
    if (!navigator.onLine) {
      showError("You're offline. Please check your internet connection.");
    } else {
      showError(error.message || "Something went wrong. Try again.");
    }
  }
}
// Fetches current weather and 5-day forecast based on latitude and longitude, updates the UI, and handles errors such as offline status or failed API calls.
async function getWeatherByCoords(lat, lon) {
  try {
    hideError(); 

    const apiKey = '0b3af9d4eb462d4d1fbc0b1a75e429cd';

    // Fetch current weather
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

    if (!weatherRes.ok) {
      throw new Error("Failed to fetch weather from your location.");
    }

    const weatherData = await weatherRes.json();
    updateWeatherUI(weatherData);
    updateDateTime(weatherData);

    // Fetch forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

    if (!forecastRes.ok) {
      throw new Error("Failed to fetch forecast data.");
    }

    const forecastData = await forecastRes.json();
    displayExtendedForecast(forecastData);

  } catch (error) {
    console.error("Error fetching weather by location:", error);

    if (!navigator.onLine) {
      showError("You're offline. Please check your internet connection.", true);
    } else {
      showError(error.message || "Failed to get weather from location.", true);
    }
  }
}

// Updates the weather UI with city name, temperature, condition, humidity, wind speed, and weather icon based on the API response data.

function updateWeatherUI(data) {
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
// Converts the Unix timestamp to a human-readable date and time format and updates the DOM with the current day, date, and time.
function updateDateTime(data) {
  const now = new Date(data.dt * 1000); // Convert Unix timestamp to milliseconds
 
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const day = days[now.getDay()];
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

// Displays the extended weather forecast (next 5 days) , showing date, temperature, wind speed, and humidity.

function displayExtendedForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  // Get today's date to compare and exclude today's forecast
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  const dailyData = {};
  data.list.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
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

// Updates the background image of the page based on the current weather condition (clear, cloudy, rain, etc.).
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
dropdownButton.addEventListener('click', (event) => {
  event.stopPropagation();  // Prevent event from bubbling up

  const dropdownMenu = document.getElementById('dropdownMenu');
  // Ensure dropdown is rendered every time the button is clicked
  renderDropdown(); 

  // Toggle visibility of the dropdown menu
  dropdownMenu.classList.toggle('hidden');

});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
 
if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
    dropdownMenu.classList.add('hidden');  // Close dropdown if clicked outside
  }
});

// This function updates the list of recent cities searched by the user
function updateRecentCities(city) {
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  city = city.trim();

  // Check if the city already exists in the recent cities list
  if (!recentCities.some(c => c.toLowerCase() === city.toLowerCase())) {
    recentCities.unshift(city); 

    // Limit the list to 5 cities
    if (recentCities.length > 5) {
      recentCities.pop();  
    }

    localStorage.setItem('recentCities', JSON.stringify(recentCities));  // Store updated list in localStorage
    // Re-render the dropdown
    renderDropdown();
  }
}
// Render the dropdown items based on recent cities stored in localStorage
function renderDropdown() {
  const dropdownMenu = document.getElementById('dropdownMenu');
  const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

  // Clear existing dropdown items
  dropdownMenu.innerHTML = '';

  // If there are no recent cities,show No recent searches yet
  if (recentCities.length === 0) {
    dropdownMenu.innerHTML = '<li class="px-4 py-2 text-sm text-gray-300">No recent searches yet</li>';
    return;
  }

  // Create a list item for each recent city
  recentCities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.classList.add('px-4', 'py-2', 'hover:bg-black/40', 'cursor-pointer');
    listItem.textContent = city;

    // When a city is selected, get the weather and hide the dropdown
    listItem.addEventListener('click', () => {
      getWeather(city);
      dropdownMenu.classList.add('hidden'); 
    });

    dropdownMenu.appendChild(listItem);
  });
}

