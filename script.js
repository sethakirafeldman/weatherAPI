// promise function ver
const getWeather = (city) => {
    const location = `${city}`;
    const apiKey = `3bfc1d6dd8d349f3ecab46491d371c9d`;
    const units = `&units=metric`
    const apiLocation = `https://api.openweathermap.org/data/2.5/weather?q=${location}${units}&APPID=${apiKey}`;
    fetch(apiLocation, {mode: 'cors'} )
        .then((response) =>  {
            // console.log(response.json());
            return response.json();
        })
        .then((response) => {
            console.log(response);
            weatherDisplay(response);
        })
        .catch ((error) => {
            console.log(`error`);
        })
};

//async/await function ver.
const getWeatherTwo = async function(city) {
    const location = `${city}`;
    const apiKey = `3bfc1d6dd8d349f3ecab46491d371c9d`;
    const units = `&units=metric`
    const apiLocation = `https://api.openweathermap.org/data/2.5/forecast?q=${location}${units}&APPID=${apiKey}`;
    // waits for server to grab data before passing into weatherDisplay.
    const response = await fetch(apiLocation, {mode: 'cors'});
    const weathData = await response.json();
    console.log(weathData);
    weatherDisplay(weathData);
};

const cityField = document.getElementById("cityName");
const submitBtn = document.getElementById("submitBtn");
document.getElementById("submitBtn").addEventListener("click", () => {
    event.preventDefault();
    console.log(cityField.value);
    // getWeather(cityField.value);
    getWeatherTwo(cityField.value);
    });

//display weather results on page
const weatherDisplay = (resp) => {
    const weatherM = document.getElementById("weatherMain");
    weatherM.innerHTML = "";
    // create city title using resp.name;
    let h3 = document.createElement("h3");
    h3.innerText = `${resp.city.name}`;
    weatherM.appendChild(h3);

    // create list items for temp, feels like, temp min, temp max, pressure.
    for (let i = 0; i < Object.keys(resp.list[0].main).length; i++) {
        const weatherKeys = [
            "Temperature", 
            "Feels Like", 
            "Today's Low", 
            "Today's High", 
            "Pressure",
            "Sea Level",
            "Ground Level",
            "Humidity",
            "Temp_kf"
        ];
        let div = document.createElement("div");
        let objKey = (Object.keys(resp.list[0].main)[i]);
        console.log(objKey);
        div.id = objKey;
        div.innerHTML = `<h4>${weatherKeys[i]}:</h2> ${resp.list[0].main[objKey]}`;
        weatherM.appendChild(div);
    };
    let description = document.createElement("div");
    description.innerHTML = `<h4>Conditions:</h4> ${resp.list[0].weather[0].description}`;
    description.id = "conditions";
    
    // api call to get weather icons
    let iconCode = `${resp.list[0].weather[0].icon}`;
    let iconSRC = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
    let icon = new Image();
    icon.src = iconSRC;
    description.appendChild(icon);
    weatherM.appendChild(description);
};

// styling options
// hide unnecessary values from DOM.
// background change depending on weather

//conditions
//clear sky