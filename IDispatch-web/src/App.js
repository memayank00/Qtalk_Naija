import React, { Component } from 'react';
import HomePage from '././components/HomePage/HomePage.js';
import { ToastContainer } from 'react-toastify';
import AppRouter   from './router/index.js';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/less/bootstrap.less';


class App extends Component {
  render() {
    const {history}=this.props;
    return (
      <div className="App">
        <AppRouter history={history}/>        
      </div>
    );
  }
}

export default App;
