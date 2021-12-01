const weatherMain = document.getElementById("weatherMain");
const tempUnit = "°C";
const units = `metric`;
const apiKey = `3bfc1d6dd8d349f3ecab46491d371c9d`;

const getIcon = (iconCode, appendable)=> {
    let icon = new Image();
    let iconSRC = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    icon.src= iconSRC;
    icon.classList.add("weather-icon");
    appendable.appendChild(icon);
};

const elMaker = (type, txt, id, append) => {
    let el = document.createElement(type);
    el.innerText = txt;
    el.id = id;
    append.appendChild(el);
};

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
        title: "Humidity",
        addon: "%"
    },

    {
        title: "Sea Level Presure",
        addon: "hPa"
    },
    {
        title: "Ground Level Pressure",
        addon: "hPa"
    },
];

//async/await function.
const getWeather = async function(city) {
    const apiLocation = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&APPID=${apiKey}`;

    // waits for server to grab data before passing into weatherDisplay.
    const response = await fetch(apiLocation, {mode: 'cors'});
    const weathData = await response.json();
    // error handling
    if (weathData.cod == "404" || weathData.cod == "400") {
        weatherMain.innerHTML = "";
        elMaker("h3","location not found", "error", weatherMain);
    }
    // return data
    else if (weathData.cod == "200") {
        // console.log(weathData);
        weatherDisplay(weathData);        
    };
};
// adds eventlistener to form.
const cityField = document.getElementById("cityName");
const submitBtn = document.getElementById("submitBtn");
document.getElementById("submitBtn").addEventListener("click", () => {
    event.preventDefault();
    getWeather(cityField.value);
    });

//display weather results on page
const weatherDisplay = (resp) => {
    weatherMain.innerHTML = "";
    // create city title using resp.name;
    elMaker("h3",resp.name,"city", weatherMain);
    elMaker("h5", "Current","current",document.getElementById("city"));
    const gridContainer = document.createElement("div");
    gridContainer.id = "grid-container";
    weatherMain.appendChild(gridContainer);

    // create grid items for temp, feels like, temp min, temp max, pressure.
    for (let i = 0; i < Object.keys(resp.main).length; i++) {
        let div = document.createElement("div");
        let objKey = (Object.keys(resp.main)[i]);
        div.id = objKey;
        div.classList.add("weatherSquare");
        div.innerHTML = `<h4>${weatherKeyObj[i].title}:</h2> ${Math.round(resp.main[objKey])}${weatherKeyObj[i].addon}`;
        gridContainer.appendChild(div);
    };
    // create description
    let description = document.createElement("div");
    description.innerHTML = `<h4>Conditions:</h4>`;
    description.id = "conditions";
    let descText = document.createElement("p");
    descText.innerText = `${resp.weather[0].description}`;
    description.appendChild(descText);
    description.classList.add("weatherSquare");

    getIcon(resp.weather[0].icon, description);
    gridContainer.appendChild(description);
    
    // get coordinates
    const lat = resp.coord.lat;
    const lon = resp.coord.lon;
    
    //HOURLY FORECAST
const genHourly = async function(lat, lon) {
    const oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,alerts,daily&units=${units}&appid=${apiKey}`;
    const hourlyResp = await fetch(oneCallAPI, {mode:`cors`});
    const hourlyRespData = await hourlyResp.json();
    //hour heading
    elMaker("h5","Hourly Forecast", "hourly",weatherMain);
     //hourly container
     const hourlyCont = document.createElement("div");
     hourlyCont.id = "hourly-container";
     weatherMain.appendChild(hourlyCont);

    for (let j=0; j < 4; j++) { // makes 4 hours.
        let hourDiv = document.createElement("div");
        // converts unix timestamp to ms then into date
        let dateConvert = new Date(hourlyRespData.hourly[j].dt*1000); 
        hourDiv.id= `hour-${j}`;
        hourDiv.classList.add("col-item");

        // cuts off ms val
        let timeOfDay = dateConvert.toLocaleTimeString().slice(-2);
        dateConvert = dateConvert.toLocaleTimeString().slice(0,-6);
        dateConvert = `${dateConvert} ${timeOfDay}`;
        hourDiv.innerText = dateConvert;
        hourlyCont.appendChild(hourDiv);

        //add hourly weather to each section.
        let hourlyData = hourlyRespData.hourly[j];
        // console.log(hourlyData);
        let hourlyWeather = document.createElement("div");
        hourlyWeather.classList.add("hourly-data");
        hourlyWeather.innerHTML =
            `Temperature: ${Math.round(hourlyData.temp)}${tempUnit}<br>
            Feels Like: ${Math.round(hourlyData["feels_like"])}<br>
            Conditions: ${hourlyData.weather[0].description}`;
        hourDiv.appendChild(hourlyWeather);
        // hourlyWeather.appendChild(icon);    
        getIcon(hourlyData.weather[0].icon, hourlyWeather);
    };
};

genHourly(lat, lon);

//weekly weather
// use one call in above func.
const getWeekly = async (lat, lon) => {
    let weeklyAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,alerts,hourly&units=${units}&appid=${apiKey}`;
    const weeklyResp = await fetch(weeklyAPI, {mode:`cors`});
    const weeklyRespData = await weeklyResp.json();
    console.log(weeklyRespData);

    //weekly container
    const weeklyCont = document.createElement("div");
    elMaker("h5", "Weekly Forecast", "weekly-title", weatherMain);
    weeklyCont.id="weekly-container";
    weatherMain.appendChild(weeklyCont);

    // day divs
    for (let k = 0; k < 7; k++) {
        
        let dayDiv = document.createElement("div");
        dayDiv.id =`day-${k+1}`;
        let dayData = weeklyRespData.daily[k];
        let dateConvert = new Date(dayData.dt*1000);
        let dateTrim = dateConvert.toDateString().slice(0,-4); // removes year
        dayDiv.innerHTML = `${dateTrim}`;
        weeklyCont.appendChild(dayDiv);
        // day content
        let dailyData = document.createElement("div");
        dailyData.classList.add("daily-data");
        dailyData.innerHTML = `
        Temperature: ${Math.round(dayData.temp.day)}<br>
        Feels Like: ${Math.round(dayData["feels_like"].day)} <br>
        Conditions: ${dayData.weather[0].description}`;
        dayDiv.appendChild(dailyData);
        getIcon(dayData.weather[0].icon, dailyData);
    };
};
getWeekly(lat, lon);
cityField.value ="";
};