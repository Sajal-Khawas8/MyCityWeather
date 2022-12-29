let search = document.getElementById("search");
let city = document.getElementById("city");
let cityCode;

// To get wind direction (convert from degree to string)
const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// RapidAPI key and host
const key = 'faeca5e3dfmsh04ba3f5b4887182p1f2772jsnc0b401e4b225';
const host = 'foreca-weather.p.rapidapi.com';

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host
    }
};

// Actual Logic --> get weather data and display
function getWeather(city) {
    // To get city code of city (RapidAPI - Location search)
    fetch(`https://${host}/location/search/${city}`, options)
        .then(response => response.json())
        .then(response => {
            cityCode = response.locations[0].id
            // To get Current Weather data using city code (RapidAPI - Current)
            fetch(`https://${host}/current/${cityCode}?alt=0&tempunit=C&windunit=KMH&lang=en`, options)
                .then(response => response.json())
                .then(response => {
                    // Display data in cards
                    temp.innerHTML = `${response.current.temperature} &#8451;`;
                    symbolPhrase.innerHTML = `${(response.current.symbolPhrase).charAt(0).toUpperCase() + (response.current.symbolPhrase).slice(1)}`;
                    feelsLikeTemp.innerHTML = `${response.current.feelsLikeTemp} &#8451;`;
                    wind.innerHTML = `${response.current.windSpeed} km/h ${response.current.windDirString}`;
                    relHumidity.innerHTML = `${response.current.relHumidity}%`;
                    visibility.innerHTML = `${response.current.visibility} m`;
                    displayCity.innerHTML = city;
                })
                .catch(err => console.error(err));

            // To get 7 day forecast using city code (Rapid API - Daily)
            fetch(`https://${host}/forecast/daily/${cityCode}?alt=0&tempunit=C&windunit=KMH&periods=8&dataset=full`, options)
                .then(response => response.json())
                .then(response => {
                    html = '';
                    for (let i = 0; i < 7; i++) {
                        // To display data in table
                        html +=
                            `<tr>
                                <th scope="row">${response.forecast[i].date}</th>
                                <td>${(response.forecast[i].symbolPhrase).charAt(0).toUpperCase() + (response.forecast[i].symbolPhrase).slice(1)}</td>
                                <td>${response.forecast[i].minTemp} &#8451;</td>
                                <td>${response.forecast[i].maxTemp} &#8451;</td>
                                <td>${response.forecast[i].sunrise}</td>
                                <td>${response.forecast[i].sunset}</td>
                                <td>${response.forecast[i].moonrise}</td>
                                <td>${response.forecast[i].moonset === null ? "-" : response.forecast[i].moonset}</td>
                                <td>${response.forecast[i].minRelHumidity}%</td>
                                <td>${response.forecast[i].maxRelHumidity}%</td>
                                <td>${response.forecast[i].maxWindSpeed} m/s ${directions[Math.round(response.forecast[i].windDir / 45) % 8]}</td>
                                <td>${response.forecast[i].minVisibility} m</td>
                                <td>${response.forecast[i].pressure} hPa</td>
                                <td>${response.forecast[i].uvIndex}</td>
                            </tr>`;
                    }
                    // Display table data after getting 7 day forecast
                    document.getElementById("7dayForecast").innerHTML = html;
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
}

// Display weather of searched city
search.addEventListener("click", (e) => {
    e.preventDefault();
    getWeather(city.value);
})

// By default, show weather of Chandigarh
getWeather("Chandigarh");