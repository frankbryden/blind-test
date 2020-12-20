import React from 'react';
import PlayerSelectionList from './PlayerSelectionList';
const electron = window.require("electron")

class Menu extends React.Component {
    constructor(props){
        super(props);

        this.handlePlaylistChange = this.handlePlaylistChange.bind(this);
        this.handleAutNextTurnChange = this.handleAutNextTurnChange.bind(this);
        this.handleRoundCountChange = this.handleRoundCountChange.bind(this);
        this.setPlayersReady = this.setPlayersReady.bind(this);
        this.startGame = this.startGame.bind(this);

        this.state = {
            spotifyAuth: false,
            playlistUri: 'spotify:playlist:22sVoQq0AM56m3uWvJe3Sj',
            autoNextTurn: true,
            roundCount: 30,
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

    handleAutNextTurnChange(e) {
        this.setState({
            autoNextTurn: !this.state.autoNextTurn
        });
    }

    handleRoundCountChange(e) {
        this.setState({
            roundCount: e.target.value
        });
    }

    startGame() {
        electron.ipcRenderer.invoke('start-game', {
            players: this.state.players,
            playlistUri: this.state.playlistUri,
            autoNextTurn: true,//this.state.autoNextTurn,
            roundCount: this.state.roundCount
        });
        this.props.startGame();
    }

    render() {
        return (
            <div>
                <PlayerSelectionList setReady={this.setPlayersReady} />
                <label htmlFor="playlistUriInput">Playlist's Spotify URI</label>
                <input onChange={this.handlePlaylistChange} value={this.state.playlistUri} type="text" id="playlistUriInput"></input><br />

                <label htmlFor="autoNextRound">Go to next round automatically</label>
                <input onChange={this.handleAutNextTurnChange} checked={this.state.autoNextTurn} type="checkbox" id="autoNextRound"></input><br />

                <label htmlFor="roundCountInput">Number of rounds</label>
                <input onChange={this.handleRoundCountChange} value={this.state.roundCount} type="number" id="roundCountInput"></input><br />

                <button onClick={this.startGame} disabled={!(this.state.playersReady && this.state.playlistUri.length > 0)}>Start Game</button>
            </div>
        )
    }
}

export default Menu;