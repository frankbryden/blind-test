import React from 'react';
//const { ipcRenderer } = window.require('electron');
const electron = window.require("electron")

const triesPerRound = 3;
class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            round: 0,
            try: 0,
        }

        electron.ipcRenderer.on("game-data", (event, message) => {
            console.log(message);
            console.log("We can start ythe game!");
        })
    }

    componentDidMount() {
        console.log("mounted!");
        // electron.ipcRenderer.invoke('perform-action', {name: "Frankie"})
        //window.ipcRenderer.invoke('perform-action', )
    }

    nextRound() {

    }

    render() {
        return (
            <div>
                <h2>Round {this.state.round}</h2>
                
            </div>
        )
    }
}

export default Game;