const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const lightTextColor = "#FAFAFA";
const darkTextColor = "#0F0F0F";

let path_to_logos = "C:\\Users\\Strathcona\\Desktop\\Logos\\";

function getValueOrPlaceholder(id) {
    let val = document.getElementById(id).value;
    return val !== "" ? val : document.getElementById(id).placeholder;
}

function formatAMPM(date) {
    // date is string of form hh:mm in 24hr time
    let hours = parseInt(date.substr(0,2));
    let minutes = parseInt(date.substr(3,2));
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

function download(filename, contents) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Set copyright notice
document.querySelector("#copyright").textContent = `© Rudy de Lorenzo, ${new Date().getFullYear()}`;

// Set smart placeholders
document.querySelector("#date").valueAsDate = new Date();
document.querySelector("#time").value = `${new Date().getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${new Date().getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;

document.querySelector("button.save").addEventListener("click", async () => {
    let data = {};

    // Store general game info first
    data["event"] = getValueOrPlaceholder("event");
    data["league"] = getValueOrPlaceholder("league");
    data["subtext"] = getValueOrPlaceholder("subtext");

    let date = new Date(getValueOrPlaceholder("date"));
    data["date"] = `${months[date.getUTCMonth()]}. ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
    data["time"] = formatAMPM(getValueOrPlaceholder("time"));

    // Store teams info
    // TODO: Combine home and away into one function
    let homeData = {};
    homeData["name"] = getValueOrPlaceholder("home-name");
    homeData["short_name"] = getValueOrPlaceholder("home-short");
    homeData["color"] = getValueOrPlaceholder("home-color").toUpperCase();
    console.log(document.querySelector('input[name="home-textcolor"]:checked').value);
    homeData["text_color"] = document.querySelector('input[name="home-textcolor"]:checked').value === "light" ? lightTextColor : darkTextColor;
    // TODO: Use File API, instead of this dirty method
    homeData["logo"] = `${path_to_logos}${getValueOrPlaceholder("home-logo").split(/(\\|\/)/g).pop()}`;

    data["home"] = homeData;


    let awayData = {};
    awayData["name"] = getValueOrPlaceholder("away-name");
    awayData["short_name"] = getValueOrPlaceholder("away-short");
    awayData["color"] = getValueOrPlaceholder("away-color").toUpperCase();
    console.log(document.querySelector('input[name="away-textcolor"]:checked').value);
    awayData["text_color"] = document.querySelector('input[name="away-textcolor"]:checked').value === "light" ? lightTextColor : darkTextColor;
    // TODO: Use File API, instead of this dirty method
    awayData["logo"] = `${path_to_logos}${getValueOrPlaceholder("away-logo").split(/(\\|\/)/g).pop()}`;

    data["away"] = awayData;

    // data now contains all the graphics data
    // save data to a JSON file

    let file = JSON.stringify(data, null, 4)

    download("game-data.json", file);

});