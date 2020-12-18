import logo from './logo.svg';
import './App.css';
import Game from './Game';
import Menu from './Menu';


function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save me to reload.
        		</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
        		</a>
				<Menu />
			</header>
		</div>
	);
}

export default App;
