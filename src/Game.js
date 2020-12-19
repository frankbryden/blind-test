import React from 'react';
//const { ipcRenderer } = window.require('electron');
const electron = window.require("electron")

const triesPerRound = 3;
class Game extends React.Component {
    constructor(props) {
        super(props);

        this.playRound = this.playRound.bind(this);
        this.nextRound = this.nextRound.bind(this);

        this.state = {
            round: 0,
            try: 0,
            message: '',
        };

        console.log("NOO");

    }

    componentDidMount() {
        console.log("mounted!");
        
        electron.ipcRenderer.once("game-data", (event, message) => {
            this.tracks = message.tracks;
            this.players = message.players;
            console.log("We can start the game!");
            this.playRound();
        });

        electron.ipcRenderer.on('song-played', () => {
            console.log('song-played');
            if (this.state.try == triesPerRound) {
                this.setMessage('Get ready for next round!');
                setTimeout(this.nextRound, 5000);
            } else {
                this.setMessage('Awaiting next try...');
                setTimeout(this.playRound, 2000);
            }
        });
        // electron.ipcRenderer.invoke('perform-action', {name: "Frankie"})
        //window.ipcRenderer.invoke('perform-action', )
    }

    setMessage(message) {
        console.log(message);
        this.setState({
            message: message
        });
    }

    nextRound() {
        console.log("nextRound()");
        this.setState({
            round: this.state.round + 1,
            try: 0
        });
        electron.ipcRenderer.send('next-round', {currentTry: this.state.try});
        this.playRound();
    }

    playRound() {
        this.setMessage('♪ Song playing ♪');
        console.log("Sending");
        electron.ipcRenderer.send('play-round', {currentTry: this.state.try});
        this.setState({
            try: this.state.try + 1
        });
    }

    render() {
        return (
            <div>
                <h2>Round {this.state.round}: Try {this.state.try}/{triesPerRound}</h2>
                <h3>{this.state.message}</h3>
            </div>
        )
    }
}

export default Game;