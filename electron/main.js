const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
const { ipcMain } = require('electron');
const { SpotifyAuthentication } = require('./spotifyAuth');
const { SpotifyControls } = require('./spotifyControls');
const Game = require('./game');
//const { queryByTitle } = require('@testing-library/react');

 
let mainWindow;

class Main {
    constructor() {
        this.authReady = this.authReady.bind(this);
        this.createWindow = this.createWindow.bind(this);
        this.spotifyAuth = new SpotifyAuthentication();

        ipcMain.handle('start-game', (event, gameData) => {
            console.log(gameData);
            console.log("We now need to fetch the tracks from the playlist");
            this.spotifyControls.fetchPlaylistContents(gameData.playlistUri)
                .then(json => {
                    let tracksData = this.shuffle(this.parseTracks(json));
                    //create new game, with tracks here.
                    this.game = new Game(this.mainWindow, this.spotifyControls, gameData.players, tracksData);
                });
            
            //this.spotifyControls.enqueue('spotify:track:0afhq8XCExXpqazXczTSve');
            
        });
    }
    authReady(token) {
        this.spotifyControls = new SpotifyControls(token);
        //this.spotifyControls.fetchPlaybackInfo();
    }

    parseTracks(tracksData) {
        return tracksData.items.map(trackData => trackData.track.uri);
    }

    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
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
    
        //this.mainWindow.removeMenu();
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
app.on('ready', main.createWindow);