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
        title: "Sea Level",
        addon: ""
    },
    {
        title: "Ground Level",
        addon: ""
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

// promise function ver
// const getWeather = (city) => {
//     const location = `${city}`;
//     const apiKey = `3bfc1d6dd8d349f3ecab46491d371c9d`;
//     const units = `&units=metric`
//     const apiLocation = `https://api.openweathermap.org/data/2.5/weather?q=${location}${units}&APPID=${apiKey}`;
//     fetch(apiLocation, {mode: 'cors'} )
//         .then((response) =>  {
//             // console.log(response.json());
//             return response.json();
//         })
//         .then((response) => {
//             // console.log(response);
//             weatherDisplay(response);
//         })
//         .catch ((error) => {
//             console.log(`error`);

//         })
// };

//async/await function ver.
const getWeatherTwo = async function(city) {
    const location = `${city}`; // seems redundant
    const apiKey = `3bfc1d6dd8d349f3ecab46491d371c9d`;
    const units = `&units=metric`
    const apiLocation = `https://api.openweathermap.org/data/2.5/forecast?q=${location}${units}&APPID=${apiKey}`;
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
        console.log(weathData);
        weatherDisplay(weathData);        
    };
};
// adds eventlistener to form.
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
    h3.id = "city";
    h3.innerText = `${resp.city.name}`;
    weatherM.appendChild(h3);
    const gridContainer = document.createElement("div");
    gridContainer.id = "grid-container";
    weatherM.appendChild(gridContainer);

    // create list items for temp, feels like, temp min, temp max, pressure.
    for (let i = 0; i < Object.keys(resp.list[0].main).length; i++) {
        let div = document.createElement("div");
        let objKey = (Object.keys(resp.list[0].main)[i]);
        // console.log(objKey);
        div.id = objKey;
        div.classList.add("weatherSquare");
        div.innerHTML = `<h4>${weatherKeyObj[i].title}:</h2> ${resp.list[0].main[objKey]}${weatherKeyObj[i].addon}`;
        gridContainer.appendChild(div);
    };
    let description = document.createElement("div");
    description.innerHTML = `<h4>Conditions:</h4>`;
    description.id = "conditions";
    let descText = document.createElement("p");
    descText.innerText = `${resp.list[0].weather[0].description}`;
    description.appendChild(descText);
    description.classList.add("weatherSquare");

    // // hide unnecessary values from DOM.
    document.getElementById("temp_kf").remove();

    // api call to get weather icons
    let iconCode = `${resp.list[0].weather[0].icon}`;
    let iconSRC = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
    let icon = new Image();
    icon.src = iconSRC;
    description.appendChild(icon);
    gridContainer.appendChild(description);

    
};

// styling options
// background change depending on weather