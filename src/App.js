import logo from './logo.svg';
import './App.css';
import Game from './Game';
import Menu from './Menu';
import React from 'react';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;


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
				<Layout>
					<Header>
						<h1>Blind Test</h1>	
					</Header>
					<Content>
						{this.state.playing ? 
							<Game /> :
							<Menu startGame={this.startGame} />}
					</Content>
				</Layout>
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
			</div>
		);
	}
}

export default App;
