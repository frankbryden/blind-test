import React from 'react';
import PlayerSelectionList from './PlayerSelectionList';
const electron = window.require("electron")

class Menu extends React.Component {
    constructor(props){
        super(props);

        this.setReady = this.setReady.bind(this);
        this.startGame = this.startGame.bind(this);

        this.state = {
            spotifyAuth: false,
            ready: false
        };
    }

    setReady(isReady, players){
        this.setState({
            ready: isReady,
            players: players,
        });
    }

    startGame() {
        electron.ipcRenderer.invoke('start-game', this.state.players);
    }

    render() {
        return (
            <div>
                <PlayerSelectionList setReady={this.setReady} />
                <button onClick={this.startGame} disabled={!this.state.ready}>Start Game</button>
            </div>
        )
    }
}

export default Menu;