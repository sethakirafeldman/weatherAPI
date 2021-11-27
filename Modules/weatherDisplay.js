//display weather results on page
const weatherDisplay = (resp) => {
    weatherMain.innerHTML = "";
    // create city title using resp.name;
    let h3 = document.createElement("h3");
    h3.id = "city";
    h3.innerText = `${resp.city.name}`;
    let h5 = document.createElement("h5");
    h5.innerText = `Current`;
    h3.appendChild(h5);
    weatherMain.appendChild(h3);
    const gridContainer = document.createElement("div");
    gridContainer.id = "grid-container";
    weatherMain.appendChild(gridContainer);

    // create grid items for temp, feels like, temp min, temp max, pressure.
    for (let i = 0; i < Object.keys(resp.list[0].main).length; i++) {
        let div = document.createElement("div");
        let objKey = (Object.keys(resp.list[0].main)[i]);
        let roundedValue = Math.round(resp.list[0].main[objKey]); // rounds up returned # vals.

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
    descText.innerText = `${resp.list[0].weather[0].description}`;
    description.appendChild(descText);
    description.classList.add("weatherSquare");

    // hide unnecessary values from DOM.
    document.getElementById("temp_kf").remove();

    // api call to get weather icons
    let iconCode = `${resp.list[0].weather[0].icon}`;
    let iconSRC = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
    let icon = new Image();
    icon.src = iconSRC;
    description.appendChild(icon);
    gridContainer.appendChild(description);

    
};

export { weatherDisplay }