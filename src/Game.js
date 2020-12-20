import React from 'react';
import CountPoints from './CountPoints';
//const { ipcRenderer } = window.require('electron');
const electron = window.require("electron")

const triesPerRound = 4;
const GameState = Object.freeze({
    WAIT_START:      Symbol("waitStart"),
    BETWEEN_TRIES:   Symbol("bTries"),
    BETWEEN_ROUNDS:  Symbol("bRounds"),
    SONG_PLAYING:    Symbol("songPlaying"),
    GAME_END:        Symbol("gameEnd"),
    GREEN: Symbol("green")
});

const messageMappings = {
    [GameState.WAIT_START]: "Loading",
    [GameState.BETWEEN_ROUNDS]: "Get ready for next round!",
    [GameState.BETWEEN_TRIES]: "Awaiting next try...",
    [GameState.SONG_PLAYING]: "♪ Song playing ♪",
};

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.playRound = this.playRound.bind(this);
        this.nextRound = this.nextRound.bind(this);

        this.state = {
            round: 0,
            try: 0,
            message: '',
            gameState: GameState.WAIT_START,
            roundCountDown: 0,
        };
        console.log("NOO");
    }

    componentDidMount() {
        console.log("mounted!");
        
        electron.ipcRenderer.once("game-data", (event, message) => {
            if (this.state.gameState != GameState.WAIT_START) {
                return;
            }
            this.tracks = message.tracks;
            this.players = message.players;
            this.autoNextTurn = message.autoNextTurn;
            this.roundCount = message.roundCount;
            console.log("We can start the game!");
            this.setState({
                gameState: GameState.BETWEEN_TRIES//GameState.GAME_END//
            });
            this.playRound();
        });

        electron.ipcRenderer.on('song-played', () => {
            console.log('song-played');
            if (this.state.gameState != GameState.SONG_PLAYING) {
                console.error("we should not be receiving song played when no song is playing");
                return;
            }
            
            if (this.state.try == triesPerRound) {
                this.setState({
                    gameState: GameState.BETWEEN_ROUNDS
                });
                //TODO 
                //Instead of going straight to next round, do a countdown
                setTimeout(this.nextRound, 5000);
            } else {
                this.setState({
                    gameState: GameState.BETWEEN_TRIES
                });
                setTimeout(this.playRound, 2000);
            }
        });
        // electron.ipcRenderer.invoke('perform-action', {name: "Frankie"})
        //window.ipcRenderer.invoke('perform-action', )
    }

    nextRound() {
        if (this.state.gameState != GameState.BETWEEN_ROUNDS) {
            console.error("we should not be receiving going to next round if not between rounds");
            return;
        }
        console.log("nextRound()");
        if (this.state.round + 1 == this.roundCount) {
            this.setState({
                gameState: GameState.GAME_END,
            });
            return;
        }
        this.setState({
            round: this.state.round + 1,
            try: 0
        });
        electron.ipcRenderer.send('next-round', {currentTry: this.state.try});
        electron.ipcRenderer.once('next-round-ready', e => {
            this.playRound();
        });
    }

    playRound() {
        if (this.state.gameState != GameState.BETWEEN_TRIES && this.state.gameState != GameState.BETWEEN_ROUNDS) {
            console.error("we should not be playing round if not between tries");
            return;
        }
        this.setState({
            gameState: GameState.SONG_PLAYING
        });
        console.log("Sending");
        electron.ipcRenderer.send('play-round', {currentTry: this.state.try});
        this.setState({
            try: this.state.try + 1
        });
    }

    render() {
        return (
            <>
                {this.state.gameState == GameState.GAME_END ? 
                <div>
                    <CountPoints players={this.players} tracks={this.tracks} roundCount={this.roundCount} />
                </div>:
                <div>
                    <h1>Round {this.state.round + 1}/{this.roundCount}</h1>
                    <h2>Try {this.state.try}/{triesPerRound}</h2>
                    <h3>{messageMappings[this.state.gameState]}</h3>
                </div>
                }
            </>
        )
    }
}

export default Game;