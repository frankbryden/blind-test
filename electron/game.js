const electron = require('electron');

class Game {
    constructor(winHandle, spotifyController, players, tracks) {
        this.winHandle = winHandle;
        this.spotifyController = spotifyController;
        this.players = players;
        this.tracks = tracks;
        this.currentTrack = 0;

        this.playRound = this.playRound.bind(this);
        //this.nextRound = this.nextRound.bind(this);

        electron.ipcMain.on('next-round', (e, message) => {
            this.currentTrack++;
            this.spotifyController.enqueue(this.tracks[this.currentTrack]);
        });

        electron.ipcMain.on('play-round', (e, message) => {
            //TODO possible pass timer duration here, not sure
            //message.count contains current try.
            console.log("Received command to play round");
            this.playRound(message.currentTry);
        });

        this.notifyGameStart();
    }

    notifyGameStart() {
        console.log("notifyGameStart")
        this.spotifyController.enqueue(this.tracks[this.currentTrack]);
        this.winHandle.webContents.send('game-data', {players:this.players, tracks:this.tracks});
    }

    async playRound(currentTry){
        if (currentTry == 0){
            //If this is the first try, we are still on the last song. Go next and play.
            await this.spotifyController.nextSong();
        } else {
            //If this is not the first try, go back to beginning and then play.
            await this.spotifyController.seekStart();
            await this.spotifyController.play();
        }
        await this.sleep(2000);
        this.spotifyController.pause();
        this.winHandle.webContents.send('song-played', {});
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}

module.exports = Game;