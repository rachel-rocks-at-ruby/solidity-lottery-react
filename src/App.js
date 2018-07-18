import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
  };

  async componentDidMount() {
    // default account is first account in MetaMask
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ 
      manager,
      players,
      balance,
    });
  }

  onEnter = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    
    this.setState({ message: 'Waiting on transaction success...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: 'You have been entered!'});
  };

  onClick = async (e) => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: 'A winner has been picked' });
  };

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p className="italics">requires <a href="https://metamask.io/">MetaMask Chrome extension</a></p>
        <p>
          This contract is managed by <span className="green">{this.state.manager}</span>.<br />
          There are currently <span className="bold">{this.state.players.length}</span> people competing to win <span className="bold">{web3.utils.fromWei(this.state.balance, 'ether')} ether</span>!
        </p>
        
        <hr />

        <form
          onSubmit={this.onEnter}
        >
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter </label>
            <input
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
            />
            <button>Enter</button>
          </div>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button className="pick-winner" onClick={this.onClick}>Pick a winner</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
