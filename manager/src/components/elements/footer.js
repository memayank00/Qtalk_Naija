import React, { Component } from 'react';
import { connect } from 'react-redux';


/*import images*/

class Footer extends Component {


    render() {
        /*if user is not logged in then return empty */
        if (!this.props.isAdminLoggedIn) return (null);

        return (
            <div>
                {/* <!-- BEGIN FOOTER --> */}
            <div className="page-footer">
                    <div className="page-footer-inner"> 2018 &copy; Athelte 
                    {/*<a target="_blank" href="">test</a> &nbsp;|&nbsp;*/}
                </div>
                    <div className="scroll-to-top">
                        <i className="icon-arrow-up"></i>
                    </div>
                </div>
                {/* <!-- END FOOTER --> */}
            </div>

        )
    }
}


/*get props*/
function mapStatesToProps(state) {
    return ({
        isAdminLoggedIn:  (state.admin.token) ? true : false
    });
}

export default connect(mapStatesToProps)(Footer);