const electron = require('electron');

class Game {
    constructor(winHandle, players, playlistUri) {
        this.winHandle = winHandle;
        this.players = players;
        this.playlistUri = playlistUri;
        this.notifyGameStart();
    }

    notifyGameStart() {
        console.log(electron.ipcMain);
        this.winHandle.webContents.send('game-data', {players:this.players, playlistUri:this.playlistUri});
    }
}

module.exports = Game;