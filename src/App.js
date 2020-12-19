import logo from './logo.svg';
import './App.css';
import Game from './Game';
import Menu from './Menu';
import React from 'react';


class App extends React.Component {

	constructor(props) {
		super(props);

		this.startGame = this.startGame.bind(this);

		this.state = {
			playing: false,
		};
	}

	startGame() {
		this.setState({playing: true});
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					{/* <img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save me to reload.
					</p>
					<a
						className="App-link"
						href="https://reactjs.org"x
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a> */}
					<div className="spacing"/>
					<h1>Blind Test</h1>	
				</header>
				{this.state.playing ? 
				<Game /> :
				<Menu startGame={this.startGame} />}
				
			</div>
		);
	}
}

export default App;
