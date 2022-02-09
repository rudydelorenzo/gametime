const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const lightTextColor = "#FAFAFA";
const darkTextColor = "#0F0F0F";

let path_to_logos = "C:\\Users\\Strathcona\\Desktop\\Logos\\";

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsText(file);
    })
}

function resetField(id) {
    document.getElementById(id).value = "";
}

function getValueOrPlaceholder(id) {
    let val = document.getElementById(id).value;
    return val !== "" ? val : document.getElementById(id).placeholder;
}

function setValueIfNotPlaceholder(id, value) {
    resetField(id);
    if (value !== document.getElementById(id).placeholder) {
        document.getElementById(id).value = value;
    }
}

function convertTimeTo24hr(time12hr) {
    const [time, modifier] = time12hr.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '0';
    }

    if (modifier === 'PM') {
        hours = `${parseInt(hours, 10) + 12}`;
    }

    if (parseInt(hours, 10) < 10) hours = `0${hours}`;

    return `${hours}:${minutes}`;
}

function convertTimeTo12hr(time24hr) {
    // time24hr is string of form hh:mm in 24hr time
    let hours = parseInt(time24hr.substr(0,2));
    let minutes = parseInt(time24hr.substr(3,2));
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
    // START VALIDATION
    if (document.getElementById("home-logo").value === ""
        || document.getElementById("away-logo").value === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Cannot save without selecting logo files.'
        });
        return;
    }
    // END VALIDATION


    let data = {};

    // Store general game info first
    data["event"] = getValueOrPlaceholder("event");
    data["league"] = getValueOrPlaceholder("league");
    data["subtext"] = getValueOrPlaceholder("subtext");

    let date = new Date(getValueOrPlaceholder("date"));
    data["date"] = `${months[date.getUTCMonth()]}. ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
    data["time"] = convertTimeTo12hr(getValueOrPlaceholder("time"));

    // Store teams info
    // TODO: Combine home and away into one function
    let homeData = {};
    homeData["name"] = getValueOrPlaceholder("home-name");
    homeData["short_name"] = getValueOrPlaceholder("home-short").substr(0, 3);
    homeData["color"] = getValueOrPlaceholder("home-color").toUpperCase();
    homeData["text_color"] = document.querySelector('input[name="home-textcolor"]:checked').value === "light" ? lightTextColor : darkTextColor;
    // TODO: Use File API, instead of this dirty method
    homeData["logo"] = document.getElementById("home-logo").files[0].path;

    data["home"] = homeData;


    let awayData = {};
    awayData["name"] = getValueOrPlaceholder("away-name");
    awayData["short_name"] = getValueOrPlaceholder("away-short").substr(0, 3);
    awayData["color"] = getValueOrPlaceholder("away-color").toUpperCase();
    awayData["text_color"] = document.querySelector('input[name="away-textcolor"]:checked').value === "light" ? lightTextColor : darkTextColor;
    // TODO: Use File API, instead of this dirty method
    awayData["logo"] = document.getElementById("away-logo").files[0].path;

    data["away"] = awayData;

    // data now contains all the graphics data
    // save data to a JSON file

    let file = JSON.stringify(data, null, 4)

    download("game-data.json", file);

});

document.querySelector("button.open").addEventListener('click', async () => {
    // Open file selector on hidden input element
    let fileSelector = document.querySelector("#open-file-input");
    fileSelector.value = "";
    fileSelector.click();
});

document.querySelector("#open-file-input").addEventListener('change', async (e) => {
    let fileSelector = e.target;
    if (fileSelector.value === "") {
        // Do nothing if file has just been reset
        return;
    }
    // Load file
    let data = JSON.parse(await readFileAsync(fileSelector.files[0]));

    // Assign fields according to data
    setValueIfNotPlaceholder("event", data["event"]);
    setValueIfNotPlaceholder("league", data["league"]);
    setValueIfNotPlaceholder("subtext", data["subtext"]);
    setValueIfNotPlaceholder("date", new Date(data["date"]).toISOString().split('T')[0]);
    setValueIfNotPlaceholder("time", convertTimeTo24hr(data["time"]));

    // Home Team fields
    let homeData = data["home"];
    setValueIfNotPlaceholder("home-name", homeData["name"]);
    setValueIfNotPlaceholder("home-short", homeData["short_name"].substr(0, 3));
    setValueIfNotPlaceholder("home-color", homeData["color"]);
    if (homeData["text_color"] === darkTextColor) {
        document.querySelector("#home-darkcolor").checked = true;
    } else {
        document.querySelector("#home-lightcolor").checked = true;
    }
    resetField("home-logo");

    // Away Team fields
    let awayData = data["away"];
    setValueIfNotPlaceholder("away-name", awayData["name"]);
    setValueIfNotPlaceholder("away-short", awayData["short_name"].substr(0, 3));
    setValueIfNotPlaceholder("away-color", awayData["color"]);
    if (awayData["text_color"] === darkTextColor) {
        document.querySelector("#away-darkcolor").checked = true;
    } else {
        document.querySelector("#away-lightcolor").checked = true;
    }
    resetField("away-logo");
});