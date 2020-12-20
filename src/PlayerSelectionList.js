import React from 'react';
import PlayerInputField from './PlayerInputField';
import {Button, List} from 'antd';

class PlayerSelectionList extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePlayerSaveToggle = this.handlePlayerSaveToggle.bind(this);
        this.handleRemovePlayer = this.handleRemovePlayer.bind(this);
        this.addPlayer = this.addPlayer.bind(this);

        this.state = {
            players: [],
        };
    }

    addPlayer() {
        //TODO why tf does this cause a duplicate update (2 players are added instead of one)
        // this.setState(state => {
        //     console.log("In set state clbk");
        //     const newPlayer = {
        //         name: `Player ${state.players.length + 1}`,
        //         saved: false
        //     };
        //     console.log(state.players);
        //     state.players = [...state.players, newPlayer];
        //     console.log(state);
        //     return state;
        // });
        const newPlayer = {
            name: `Player ${this.state.players.length + 1}`,
            saved: false
        };
        this.setState({
            players: [...this.state.players, newPlayer],
        });
    }

    handleInputChange(playerId, newValue) {
        this.setState(state => {
            state.players[playerId].name = newValue;
            return state;
        })
    }

    // handlePlayerSaveToggle(playerId) {
    //     this.setState(state => {
    //         console.log(JSON.stringify(state));
    //         state.players[playerId].saved = !state.players[playerId].saved;
    //         console.log(JSON.stringify(state));
    //         return state;
    //     });
    // }

    checkReady(players) {
        let ready;
        if (players.length > 0 && players.filter(player => !player.saved).length == 0) {
            ready = true;
        } else {
            ready = false;
        }
        console.log(`Ready is now ${ready}`);
        this.props.setReady(ready, players);
    }

    handlePlayerSaveToggle(playerId) {
        let players = this.state.players;
        players[playerId].saved = !players[playerId].saved;
        this.checkReady(players);
        this.setState({
            players: players
        });
    }

    handleRemovePlayer(playerId) {
        let players = this.state.players;
        players.splice(playerId, 1);
        this.checkReady(players);
        this.setState({
            players: players
        });
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <Button onClick={this.addPlayer}>Add Player</Button>
                <ul>
                    {this.state.players.map((player, playerId) => (
                        <li key={playerId}>
                            <PlayerInputField
                                playerId={playerId}
                                value={player.name}
                                saved={player.saved}
                                handleInputChange={this.handleInputChange}
                                handlePlayerSaveToggle={this.handlePlayerSaveToggle}
                                handleRemovePlayer={this.handleRemovePlayer} />
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

}

export default PlayerSelectionList;