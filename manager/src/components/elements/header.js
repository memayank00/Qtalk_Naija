import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { NavDropdown, MenuItem } from "react-bootstrap";
import { push } from "react-router-redux";

import Notifications from "./notifications";
/**action types */
import { ADMIN_LOGOUT } from "../common/actions";
import Session from "../../services/session";
/*import images*/
import avtar from "../../assets/avatar.jpg";
import logo from "../../assets/logo.png";

/**sockets */
import Socket from "../../sockets";
import { toast } from "react-toastify";

class Header extends Component {
    constructor(props) {
        super(props);
        /*bind this with current class object*/
        this.logout = this.logout.bind(this);
        this.logoutAll = this.logoutAll.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.getNotifications = this.getNotifications.bind(this);
    }

    componentWillMount() {
        /**to call the notification event of socket */
        /**used do-while to ensure that socket listen event only once */
        do {
            const { user } = this.props;
            if (user)
                Socket.listenEvent("notified", {
                    userId: user._id,
                    toast: true
                });
        } while (false);

        /** get notifications... */
        this.getNotifications();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.unreadcount)
            this.setState({ unreadcount: nextProps.unreadcount });
    }

    render() {
        const { user, isAdminLoggedIn } = this.props;
        /*if user is not logged in then return empty */
        if (!isAdminLoggedIn) return null;

        if (user) {
            /** Listen for notifications */
            Socket.listenEvent("connected", {
                userId: user._id,
                loginCall: true
            });
            Socket.logoutCall().then(result => this.logout());
        };
        const imgStyle={
            margin:'3px 0 2px 2px !important'
        };

        return (
           
            <div>
                {/* <!-- BEGIN HEADER --> */}
                <div className="page-header navbar navbar-fixed-top">
                    {/* <!-- BEGIN HEADER INNER --> */}
                    <div className="page-header-inner ">
                        {/* <!-- BEGIN LOGO --> */}
                        <div className="page-logo">
                            {/* <h3 className="logo-text logo-default">
                                Administrative
                            </h3> */}
                           
                             <img
                             style={imgStyle}
                         
                            src={logo}
                            alt="Nick"
                           />
                         
                           
                        </div>
                        {/* <!-- END LOGO --> */}
                        {/* <!-- BEGIN RESPONSIVE MENU TOGGLER --> */}
                        <a
                            href="#"
                            className="menu-toggler responsive-toggler"
                            data-toggle="collapse"
                            data-target=".navbar-collapse"
                        >
                            <span />
                        </a>
                        {/* <!-- END RESPONSIVE MENU TOGGLER --> */}
                        {/* <!-- BEGIN TOP NAVIGATION MENU --> */}
                        <div className="top-menu">
                            <ul className="nav navbar-nav pull-right">
                                {/* <!-- BEGIN NOTIFICATION DROPDOWN --> */}
                                <li
                                    className="dropdown dropdown-extended dropdown-notification"
                                    id="header_notification_bar"
                                >
                                    <a
                                        className="dropdown-toggle"
                                        data-toggle="expand"
                                        data-hover="dropdown"
                                        data-close-others="true"
                                        onClick={this.toggleDropdown}
                                    >
                                        <i className="icon-bell" />
                                        {this.state &&
                                        this.state.unreadcount ? (
                                            <span className="badge badge-default">
                                                {" "}
                                                {this.state.unreadcount}{" "}
                                            </span>
                                        ) : null}
                                    </a>
                                    <Notifications />
                                </li>
                                <li>
                                    <Link to="/profile" className="profile_img">
                                        <img
                                            className="img-circle user-icon"
                                            src={
                                                user.image && user.image.url
                                                    ? user.image.url
                                                    : avtar
                                            }
                                            alt="Nick"
                                        />
                                    </Link>
                                </li>

                                <NavDropdown
                                    id="top-nav-header"
                                    title={user.firstname}
                                >
                                    <MenuItem
                                        componentClass="span"
                                        className="menu-item"
                                    >
                                        {" "}
                                        <Link to="/profile">My Profile</Link>
                                    </MenuItem>
                                    <MenuItem
                                        componentClass="span"
                                        className="menu-item"
                                    >
                                        <Link to="/change-password">
                                            Change Password
                                        </Link>
                                    </MenuItem>
                                    <MenuItem divider />
                                    <MenuItem
                                        componentClass="span"
                                        className="menu-item"
                                    >
                                        <a
                                            href="javascript:;"
                                            onClick={this.logout}
                                        >
                                            Logout
                                        </a>
                                    </MenuItem>
                                </NavDropdown>
                                {/* <!-- END NOTIFICATION DROPDOWN --> */}

                                {/* <!-- END USER LOGIN DROPDOWN --> */}
                            </ul>
                        </div>
                        {/* <!-- END TOP NAVIGATION MENU --> */}
                    </div>
                    {/* <!-- END HEADER INNER --> */}
                </div>
                {/* <!-- END HEADER --> */}
                {/* <!-- BEGIN HEADER & CONTENT DIVIDER --> */}
                <div className="clearfix"> </div>
                {/* <!-- END HEADER & CONTENT DIVIDER --> */}

                {/* <!-- BEGIN CONTAINER --> */}
                <div className="page-container" />
            </div>
        );
    }

    toggleDropdown(e) {
        /*get notification on component init*/
        const { dispatch } = this.props;

        this.setState({ unreadcount: 0 });

        this.props.dispatch({
            type: "Dashboard-toggleDropdown_reducer",
            action: "show"
        });

        /*dispatch an action and get notifications*/
        dispatch({
            type: "Dashboard-notifications",
            read: true
        });
    }

    logout() {
        this.props.dispatch({
            type: ADMIN_LOGOUT,
            success: e => {
                /*redirect user to login*/
                //Socket.callEvent("logout", {userId: user._id});
                this.props.dispatch(push("/login"));
            }
        });
    }

    logoutAll() {
        Session.clearSession("token");
        Session.clearSession("user");
        Session.clearSession("permissions");
        this.props.dispatch(push("/login"));
        //Socket.callEvent("logout", {userId: this.props.user._id});
    }

    getNotifications() {
        /*dispatch an action and get notifications*/
        /*get notifications of user when user data available*/
        this.props.dispatch({
            type: "Dashboard-notifications"
        });
    }
}

/*get props*/
function mapStatesToProps(state) {
    return {
        isAdminLoggedIn: state.admin.token ? true : false,
        user: state.admin && state.admin.user ? state.admin.user : null,
        count: state.dashboard.count ? state.dashboard.count : 0,
        unreadcount: state.dashboard.unreadcount
            ? state.dashboard.unreadcount
            : 0
    };
}

export default connect(mapStatesToProps)(Header);
