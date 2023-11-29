// Define API key
const APIWeatherKey = "fb1130c719319a0964cd2ff0907f2735";
// Array to store search history
let searchHistory = [];


// Event listener for form submission
document.getElementById("city-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the city name from the input field
    const cityName = document.getElementById("city-input").value.trim();

    try {
        // Fetch weather data for the entered city
        const weatherData = await getWeatherData(cityName);

        // Update the page with the received weather data
        updatePageWithWeatherData(weatherData);

        // Save the searched city to the search history array
        saveToSearchHistory(cityName);

        // Display the search history
        displaySearchHistory();

        console.log("Weather Data:", weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Handle the error (display an error message to the user, etc.)
    }
});

// Function to save the searched city to the search history array
function saveToSearchHistory(cityName) {
    // Add the city to the search history array
    searchHistory.push(cityName);

    // Limit the search history to a certain number of items (e.g., 5)
    if (searchHistory.length > 5) {
        searchHistory.shift(); // Remove the oldest entry
    }

    // Save the search history to localStorage if you want to persist it across page reloads
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
// Function to display the search history in the "search-history" section
function displaySearchHistory() {
    const searchHistoryList = document.getElementById("search-history-list");

    // Clear previous content
    searchHistoryList.innerHTML = "";

    // Iterate through the search history array and create list items
    searchHistory.forEach(city => {
        const listItem = document.createElement("li");
        listItem.textContent = city;
        searchHistoryList.appendChild(listItem);
    });
}

// Add event listener for the "Clear History" button
document.getElementById("clear-history-btn").addEventListener("click", function () {
    // Clear the search history array
    searchHistory = [];

    // Update the displayed search history
    displaySearchHistory();

    // Optionally, you can clear the localStorage as well
    localStorage.removeItem("searchHistory");
});

// Function to fetch weather data from the OpenWeatherMap API
async function getWeatherData(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIWeatherKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Weather data not available for ${cityName}`);
        }

        const weatherData = await response.json();

        // Update the page with the received weather data
        updatePageWithWeatherData(weatherData);

        // Call the function to fetch and display the 5-day forecast
        getFiveDayForecast(cityName);

        console.log("Weather Data:", weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Handle the error (display an error message to the user, etc.)
    }
}

// Function to update the page with weather data
function updatePageWithWeatherData(weatherData) {
    // Check if weatherData has the expected structure
    if (weatherData && weatherData.name && weatherData.main && weatherData.weather && weatherData.weather.length > 0 && weatherData.wind) {
        const {
            name,
            main: { temp, humidity },
            weather: [{ description, icon }],
            wind: { speed },
        } = weatherData;

        // Function to convert Kelvin to Celsius
        function convertKelvinToCelsius(kelvin) {
            return kelvin - 273.15;
        }

        // Function to convert Celsius to Fahrenheit
        function convertCelsiusToFahrenheit(celsius) {
            return (celsius * 9 / 5) + 32;
        }

        // Convert temperature to Celsius and then to Fahrenheit, rounding to two decimal places
        const tempCelsius = convertKelvinToCelsius(temp);
        const tempFahrenheit = convertCelsiusToFahrenheit(tempCelsius).toFixed(2);

        // Update the current weather section
        document.getElementById("current-weather").innerHTML = `
            <h2>${name} Weather</h2>
            <div>
                <p>Temperature: ${tempFahrenheit} &deg;F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Weather: ${description}</p>
                <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description} icon">
                <p>Wind Speed: ${speed} m/s</p>
            </div>
        `;
    } else {
        console.error("Invalid weather data structure:", weatherData);
        // Handle the error (display an error message to the user, etc.)
    }
}

// Function to initialize the page with the search history from localStorage
function init() {
    const storedSearchHistory = localStorage.getItem("searchHistory");

    if (storedSearchHistory) {
        searchHistory = JSON.parse(storedSearchHistory);
        displaySearchHistory();
    }
}
// Call the init function to load search history on page load
init();

// Function to fetch and display the 5-day forecast
async function getFiveDayForecast(cityName) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIWeatherKey}`;

    try {
        const response = await fetch(forecastApiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch 5-day forecast");
        }

        const forecastData = await response.json();
        updatePageWithFiveDayForecast(forecastData.list);
        console.log("Forecast Data:", forecastData);
    } catch (error) {
        console.error("Error fetching 5-day forecast:", error);
        // Handle the error (display an error message to the user, etc.)
    }
}

// Function to update the page with the 5-day forecast
function updatePageWithFiveDayForecast(forecastList) {
    const forecastRow = document.getElementById("forecast-row");

    // Clear previous content
    forecastRow.innerHTML = "";

    // Extract unique days from the forecast list
    const uniqueDays = [...new Set(forecastList.map(entry => {
        const date = new Date(entry.dt * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }))];

    // Iterate through the unique days and update the page
    uniqueDays.slice(0, 5).forEach(day => {
        const dayForecasts = forecastList.filter(entry => {
            const date = new Date(entry.dt * 1000);
            return date.toLocaleDateString('en-US', { weekday: 'short' }) === day;
        });
        // Create a column for each day
        const col = document.createElement("div");
        col.classList.add("col");
        col.innerHTML = `<h4>${day}</h4>`;
        // Iterate through the forecasts for the day and add them to the column
        dayForecasts.slice(0, 1).forEach(dayForecast => {
            const temperature = (dayForecast.main.temp - 273.15) * 9 / 5 + 32;
            const humidity = dayForecast.main.humidity;
            const weatherDescription = dayForecast.weather[0].description;

            const forecastItem = document.createElement("div");
            forecastItem.classList.add("forecast-item");
            forecastItem.innerHTML = `
                <p>Temperature: ${temperature.toFixed(2)} &deg;F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Weather: ${weatherDescription}</p>
            `;

            col.appendChild(forecastItem);
        });

        // Append the column to the forecast row
        forecastRow.appendChild(col);
    });
}