import {getWeatherTwo} from './Modules/getWeatherTwo.js';
import { weatherDisplay } from './Modules/weatherDisplay.js';

const weatherMain = document.getElementById("weatherMain");
const tempUnit = "°C";

const weatherKeyObj = [
    {
        title: "Temperature",
        addon: `${tempUnit}`   
    },
    {
        title: "Feels Like",
        addon: `${tempUnit}`
    },
    {
        title: "Today's Low",
        addon: `${tempUnit}`
    },
    {
        title: "Today's High",
        addon: `${tempUnit}`
    },
    {
        title: "Pressure",
        addon: "hPa"
    },
    {
        title: "Sea Level Presure",
        addon: "hPa"
    },
    {
        title: "Ground Level Pressure",
        addon: "hPa"
    },
    {
        title: "Humidity",
        addon: "%"
    },
    {
        title: "Temp Kf",
        addon: ""
    }
];



// adds eventlistener to form.
const cityField = document.getElementById("cityName");
const submitBtn = document.getElementById("submitBtn");
document.getElementById("submitBtn").addEventListener("click", () => {
    event.preventDefault();
    console.log(cityField.value);
    // getWeather(cityField.value);
    getWeatherTwo(cityField.value);
    });

