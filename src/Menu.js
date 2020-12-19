import { TouchBarScrubber } from 'electron';
import React from 'react';
import PlayerSelectionList from './PlayerSelectionList';
//const electron = window.require("electron")

class Menu extends React.Component {
    constructor(props){
        super(props);

        this.handlePlaylistChange = this.handlePlaylistChange.bind(this);
        this.setPlayersReady = this.setPlayersReady.bind(this);
        this.startGame = this.startGame.bind(this);

        this.state = {
            spotifyAuth: false,
            playlistUri: '',
            playersReady: false,
        };
    }

    setPlayersReady(isReady, players){
        this.setState({
            playersReady: isReady,
            players: players,
        });
    }

    handlePlaylistChange(e) {
        this.setState({
            playlistUri: e.target.value,
        });
    }

    startGame() {
        //electron.ipcRenderer.invoke('start-game', this.state.players);
    }

    render() {
        return (
            <div>
                <PlayerSelectionList setReady={this.setPlayersReady} />
                <label for="playlistUriInput">Playlist's Spotify URI</label>
                <input onChange={this.handlePlaylistChange} value={this.state.playlistUri} type="text" id="playlistUriInput"></input>
                <button onClick={this.startGame} disabled={!this.state.playersReady}>Start Game</button>
            </div>
        )
    }
}

export default Menu;