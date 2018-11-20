import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      msg: ''
    }
    
  }

  componentDidMount(){
    axios.get('http://0.0.0.0:8000/api/test')
    .then((json) => {
          console.log(json.data);
          this.setState(json.data)
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.state.msg}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
