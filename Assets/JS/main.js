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
