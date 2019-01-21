import React, { Component } from 'react';

class Loader extends Component{
    render(){
      return (  
            <div className="c-loader">
              <div className="lds-ripple">
                <div></div>
                <div></div>
              </div>
            </div>
        )
    }
}

export default Loader;