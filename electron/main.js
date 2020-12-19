const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
const { ipcMain } = require('electron');
const { SpotifyAuthentication } = require('./spotifyAuth');
const { SpotifyControls } = require('./spotifyControls');
//const { queryByTitle } = require('@testing-library/react');

ipcMain.handle('perform-action', (event, ...args) => {
    console.log(args);
});
 
let mainWindow;

class Main {
    constructor() {
        this.authReady = this.authReady.bind(this);
        this.createWindow = this.createWindow.bind(this);
        this.spotifyAuth = new SpotifyAuthentication();
    }
    authReady(token) {
        this.spotifyControls = new SpotifyControls(token);
        //this.spotifyControls.fetchPlaybackInfo();
        //this.playRound();
    }

    async playRound(){
        this.spotifyControls.enqueue();
        this.spotifyControls.nextSong();
        await this.sleep(1000);
        this.spotifyControls.pause();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    createWindow() {
        console.log("Creating window...")
        this.mainWindow = new BrowserWindow({
            width:800,
            height:600,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                preload: 'preload.js'
            },
        });
        
        const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    
        this.mainWindow.loadURL(startURL);
        this.mainWindow.once('ready-to-show', () => {
            
            this.mainWindow.show();
            this.spotifyAuth.authUser(this.authReady);
            
        });
        this.mainWindow.on('closed', () => {
            console.log('closed');
            this.mainWindow = null;
            app.exit(0);
        });
    }
}
const main = new Main();

ipcMain.handle('start-game', (event, players) => {
    console.log(players);
});
app.on('ready', main.createWindow);