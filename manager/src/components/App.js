import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import HTTP from "../services/http";
import { connect } from "react-redux";

import AppRouter from "../router/index";
import { Check_For_BlackList } from "../components/common/actions";

class App extends Component {
  constructor(props) {
    super(props);

    this.blacklist = this.blacklist.bind(this);
  }
  // componentWillMount() {
  //   if (process.env.NODE_ENV === "production") {
  //     this.blacklist();
  //   }
  // }
  render() {
    return (
      <div>
        <div className="page-header-fixed page-sidebar-closed-hide-logo page-content-white">
          <div className="page-wrapper">
            <AppRouter history={this.props.history} />
          </div>
        </div>
        <ToastContainer
          position="top-right"
          type="error"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
        />
      </div>
    );
  }

  blacklist() {
    const { dispatch } = this.props;
    HTTP.Request("get", window.admin.validateSession)
      .then(result => {
        /**dispatch an action for setting value in store */
        dispatch({
          type: Check_For_BlackList,
          data: result.__ack
        });
      })
      .catch(err => false);
  }
}
/**use connect to dispacth an action */
export default connect()(App);
