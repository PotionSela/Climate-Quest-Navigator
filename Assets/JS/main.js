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