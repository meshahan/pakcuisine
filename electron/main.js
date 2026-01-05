const { app, BrowserWindow } = require('electron');
const path = require('path');

// Determine if we are running in development mode
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Pak Cuisine Pro",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Allows using Node.js in the renderer (simplifies migration)
        },
        autoHideMenuBar: true, // Hides the default menu bar for a cleaner look
    });

    if (isDev) {
        // In dev, load localhost
        console.log("Loading Development URL...");
        win.loadURL('http://localhost:3000');
        // Open DevTools
        win.webContents.openDevTools();
    } else {
        // In production, load the built index.html
        // We navigate one directory up (..) because this file is in /electron/
        console.log("Loading Production File...");
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
