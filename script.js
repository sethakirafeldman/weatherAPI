
const getWeather = () => {
    // promise function
    const location = `Toronto`;
    const apiKey = `3bfc1d6dd8d349f3ecab46491d371c9d`;
    let apiLocation = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
    fetch(apiLocation, {mode: 'cors'} )
        .then((response) =>  {
            // console.log(response.json());
            return response.json();
        })
        .then((response) => {
            weatherDisplay(response);
        })
        .catch ((error) => {
            console.log(`error`);
        })
};

getWeather();

//async function section

const weatherDisplay = (resp) => {
    const weatherM = document.getElementById("weatherMain");
    // create city title using resp.name;
    let h3 = document.createElement("h3");
    h3.innerText = `${resp.name}`;
    weatherM.appendChild(h3);

    // create list items for temp, feels like, temp min, temp max, pressure.
    for (let i = 0; i < Object.keys(resp.main).length; i++) {
        const weatherKeys = ["Temperature", "Feels Like", "Temperature Minimum", "Temperature Maximum", "Pressure", "Humidity"];
        let div = document.createElement("div");
        let objKey = (Object.keys(resp.main)[i]);
        div.id = objKey;
        div.innerHTML = `<h4>${weatherKeys[i]}:</h2> ${resp.main[objKey]}`;
        weatherM.appendChild(div);
    };


    // weatherM.innerText = resp.main.temp;
};