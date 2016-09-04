import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  setup() {
    window.open(window.location.origin + "/init")
    document.getElementById("btn1").disabled = true;
  }

  table() {
    window.open(window.location.origin + "/createtable")
    document.getElementById("btn2").disabled = true;
  }

  reload() {
    window.open(window.location.origin + "/reload")
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Usage Archive</h2>
        </div>
        <p className="App-intro">

        </p>

        <p><button id="btn1" className="btn" onClick={this.setup}>1. Initial Setup</button></p>
        <p><button id="btn2" className="btn" onClick={this.table}>2. Create Table</button></p>
        <p><button id="btn3" className="btn" onClick={this.reload}>3. Reload Mapping</button></p>
      </div>
    );
  }
}

export default App;
