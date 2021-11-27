const getWeatherTwo = async function(city) {
    console.log("test");
//     const apiKey = `3bfc1d6dd8d349f3ecab46491d371c9d`;
//     const units = `metric`;
//     const apiLocation = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&APPID=${apiKey}`;
//     // waits for server to grab data before passing into weatherDisplay.
//     const response = await fetch(apiLocation, {mode: 'cors'});
//     const weathData = await response.json();
//     // error handling
//     if (weathData.cod == "404" || weathData.cod == "400") {
//         weatherMain.innerHTML = "";
//         let errorDisplay = document.createElement("H3");
//         errorDisplay.innerText = `Location not found.`
//         weatherMain.appendChild(errorDisplay);
//     }
//     // return data
//     else if (weathData.cod == "200") {
//         console.log(weathData);
//         weatherDisplay(weathData);        
//     };
// };

export {getWeatherTwo};