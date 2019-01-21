import React, { Component } from 'react';
import './404.css';

class ErrorContent extends Component {
  	render() {
    	return (
            <div className="container-woo">
            <div className="boo-wrapper">
              <div className="boo">
                <div className="face"></div>
              </div>
              <div className="shadow"></div>
          
              <h1>Whoops!</h1>
              <p>
                We couldn't find the page you
                <br />
                were looking for.
              </p>
            </div>
          </div>
    	);
  	}
}

export default ErrorContent;

