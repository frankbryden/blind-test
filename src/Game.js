import React from 'react';
//const { ipcRenderer } = window.require('electron');
const electron = window.require("electron")


class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("mounted!");
        
        electron.ipcRenderer.invoke('perform-action', {name: "Frankie"})
        //window.ipcRenderer.invoke('perform-action', )
    }

    render() {
        return (
            <h1>It worked!</h1>
        )
    }
}

export default Game;