const electron = require("electron");

const {app, BrowserWindow} = electron;

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadFile('index.html');
    //win.webContents.openDevTools();
}

app.on('window-all-closed', function () {
    app.quit();
})

app.whenReady().then(() => {
    createWindow();
})