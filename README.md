# Weather Forecast App

A responsive weather forecast web application that displays real-time weather conditions, extended 5-day forecasts, and dynamic backgrounds based on weather conditions. Built using **HTML**, **CSS (TailwindCSS)**, and **JavaScript**, and powered by the **OpenWeatherMap API**.

---


## Features

- Search current weather by city name.
- View temperature, humidity, wind speed, and weather conditions.
- Dynamic background images based on weather conditions (Clear, Rainy, Snowy, etc.).
- 5-day extended forecast.
- Recent search history dropdown.
- Responsive design (works on iPhone SE, iPad Mini, and Desktop).

---

## Tech Stack

- HTML5
- TailwindCSS
- JavaScript (Vanilla)
- OpenWeatherMap API

---

##  Setup Instructions

 1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/weather-forecast-app.git
    cd weather-forecast-app
 2. **Obtain an API Key**

    - Go to [OpenWeatherMap](https://openweathermap.org/).
    - Create a free account and generate an API key.

 3. **Update API Key in Code**

       In your JavaScript file (e.g., `script.js`), replace:
 
        const apiKey = "YOUR_API_KEY_HERE"

## folder structure

```
├── index.html
├── style.css (or Tailwind build output)
├── script.js
├── assets/
    ├── clear.jpg
    ├── rain.jpg
    ├── snow.jpg
    ├── thunder.jpg
    ├── cloudy.jpeg
    ├── mist.jpg
    └── default.jpg
```

## Run the App

1. Open the `index.html` file directly in your browser.
   
   - You can simply double-click on the `index.html` file to open it in any modern browser (e.g., Chrome, Firefox, Safari).
   - The app will load and show the weather forecast page.

2. No server setup is required as this is a **pure frontend project**.
   
   - The app does not need to be hosted on a web server.
   - All the functionality (fetching weather data, displaying it) works directly from the browser.

3. Once opened in the browser, you should be able to:
   - Search for a city and view current weather and 5-day forecast.
   - See dynamic background images based on weather conditions (Clear, Rainy, etc.).

---

## Usage

1. **Search for a City:**
   - Enter a city name in the search bar at the top of the app.
   - Press **Enter** or click the **Search** button.

2. **View Current Weather:**
   - After entering a city name, the app will display the current weather information, including:
     - Temperature
     - Humidity
     - Wind Speed
     - Weather conditions (Clear, Rainy, Snowy, etc.)

3. **View 5-Day Forecast:**
   - The app will show a 5-day forecast with details such as temperature, humidity, and weather conditions for each day.

4. **Recent Searches:**
   - After performing a search, the city name will appear in the **Recent Searches** dropdown.
   - You can click on any of the recent city names to quickly fetch its weather data again.

5. **Dynamic Backgrounds:**
   - Based on the weather conditions (Clear, Rainy, Snowy, etc.), the background of the app will change to match the current weather, providing a visually dynamic experience.
  
##  Live Demo
Check out my weather dashboard live here: **[weather dashboard]()**

##  Contact Me
 **Email:** varshaboddapati24@gmail.com     
 **LinkedIn:** https://www.linkedin.com/in/varsha-boddapati-9a9124211/

---

**Feel free to fork, use, or modify this project! 😊**


   



