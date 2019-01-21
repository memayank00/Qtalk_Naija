import React, { Component } from 'react';
import { connect } from 'react-redux';
/**CSS */
import './HomePage.css';

class DetectMobile extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
    };

    /**event binding  */
    this.checkMobile = this.checkMobile.bind(this);
  }

  render() {
    const {match} = this.props;
    return (
      <div className="App">
          
      </div>
    );
  }

  /**this hook will run after component mounted in DOM */
  componentDidMount() {
    this.checkMobile();
  } 

  checkMobile() {
    const {dispatch,history} = this.props;
    if(navigator.userAgent.match(/Android/i)){
        window.location.href = "https://play.google.com/store/apps/details?id=com.trackingapplivetrack";
	}
	if(navigator.userAgent.match(/iPhone/i)){
        window.location.href = "https://itunes.apple.com/us/app/tracking-app-live/id1444722171?ls=1&mt=8";
	}
	if(navigator.userAgent.match(/iPad/i)){
        window.location.href = "https://itunes.apple.com/us/app/tracking-app-live/id1444722171?ls=1&mt=8";
	}
  }
}

export default connect()(DetectMobile);
