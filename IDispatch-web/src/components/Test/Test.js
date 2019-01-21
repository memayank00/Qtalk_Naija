import React, { Component } from 'react';
import { connect } from 'react-redux';
import {toast} from "react-toastify";
/**Components */

/**services */
import HTTP from '../../services/http';
import session from '../../services/session';

/**CSS */
//import ErrorBoundry from "../common/errorBoundry";


class Test extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
    };

    /**event binding  */
  }

  render() {
    const {content,tests} =this.state;
    const {match} = this.props;
    return (
      <div className="App">
        <p>Test  page-----</p>
      </div>
    );
  }


}

export default connect()(Test);
