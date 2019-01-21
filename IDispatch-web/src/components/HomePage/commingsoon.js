import React, { Component } from 'react';
import { connect } from 'react-redux';
/**services */

class commingsoon extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
      isLoadingTests:false,
    };
  }

  render() {
    return (
      <div className="App">
          <h1 style={{textAlign:'center', color:'#ff7e18', marginTop:'14%', marginBottom:'1%'}}>Coming Soon ....</h1>  

      </div>
    );
  }
 
}

export default connect()(commingsoon);
