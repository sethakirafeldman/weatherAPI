const weatherMain = document.getElementById("weatherMain");
const tempUnit = "°C";
const units = `metric`;
const apiKey = `3bfc1d6dd8d349f3ecab46491d371c9d`;

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
        let errorDisplay = document.createElement("H3");
        errorDisplay.innerText = `Location not found.`
        weatherMain.appendChild(errorDisplay);
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
    // console.log(cityField.value);
    // getWeather(cityField.value);
    getWeather(cityField.value);
    });

//display weather results on page
const weatherDisplay = (resp) => {
    weatherMain.innerHTML = "";
    // create city title using resp.name;
    let h3 = document.createElement("h3");
    h3.id = "city";
    h3.innerText = `${resp.name}`;
    let h5 = document.createElement("h5");
    h5.innerText = `Current`;
    h3.appendChild(h5);
    weatherMain.appendChild(h3);
    const gridContainer = document.createElement("div");
    gridContainer.id = "grid-container";
    weatherMain.appendChild(gridContainer);

    // create grid items for temp, feels like, temp min, temp max, pressure.
    for (let i = 0; i < Object.keys(resp.main).length; i++) {
        let div = document.createElement("div");
        let objKey = (Object.keys(resp.main)[i]);
        // console.log(objKey);
        let roundedValue = Math.round(resp.main[objKey]); // rounds up returned # vals.

        // console.log(objKey);
        div.id = objKey;
        div.classList.add("weatherSquare");
        div.innerHTML = `<h4>${weatherKeyObj[i].title}:</h2> ${roundedValue}${weatherKeyObj[i].addon}`;
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

    // // hide unnecessary values from DOM.
    // document.getElementById("temp_kf").remove();

    // api call to get weather icons
    let iconCode = `${resp.weather[0].icon}`;
    let iconSRC = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
    let icon = new Image();
    icon.src = iconSRC;
    description.appendChild(icon);
    gridContainer.appendChild(description);

    // get coordinates
    const lat = resp.coord.lat;
    const lon =resp.coord.lon;
    
    //HOURLY FORECAST
const genHourly = async function(lat, lon) {
    const oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,alerts,daily&units=${units}&appid=${apiKey}`;
    const hourlyResp = await fetch(oneCallAPI, {mode:`cors`});
    const hourlyRespData = await hourlyResp.json();

    //hour heading
    let hourTitle = document.createElement("h3");
    hourTitle.innerText="Hourly";
    hourTitle.id="hourly";
    weatherMain.appendChild(hourTitle);

     //container
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
        // get icon api call. this should be made into a function that can be used here and in weatherDisplay() 
        let iconCode = `${hourlyData.weather[0].icon}`; 
        let icon = new Image();
        let iconSRC = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        icon.src= iconSRC;
        icon.classList.add("weather-icon");
      

        hourlyWeather.innerHTML =
            `Temperature: ${Math.round(hourlyData.temp)}${tempUnit}<br>
            Feels Like: ${Math.round(hourlyData["feels_like"])}<br>
            Conditions: ${hourlyData.weather[0].description}`;
        hourDiv.appendChild(hourlyWeather);
        hourlyWeather.appendChild(icon);    
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
    weeklyCont.id="weekly-container";
    weatherMain.appendChild(weeklyCont);

    // day divs
    for (let k = 0; k < 7; k++) {
        let dayDiv = document.createElement("div");
        dayDiv.id =`day-${k+1}`;
        let dateConvert = new Date(weeklyRespData.daily[k].dt*1000);
        let dateTrim = dateConvert.toDateString().slice(0,-4); // removes year
        dayDiv.innerHTML = `${dateTrim}`;
        
        weeklyCont.appendChild(dayDiv);

    };




};

getWeekly(lat, lon);

cityField.value ="";


};




// styling options
// background change depending on weather

// split code into modules - requires webpack or running on server.









// weekly forecast