import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
/*Custom components*/
import NotificationLI from "./notification-list";

class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    /*componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }*/

    render() {
        /*rendering the view for notifications*/
        return (
            <ul
                ref={this.setWrapperRef}
                className={
                    "dropdown-menu notification-menu " + this.props.showDropdown
                }
            >
                <li className="external">
                    <h3>
                        <span className="bold">
                            {this.props.unreadcount > 0
                                ? this.props.unreadcount + " pending"
                                : "No new"}
                        </span>{" "}
                        notifications
                    </h3>
                    <Link to="/notifications">view all</Link>
                </li>
                <li>
                    <ul
                        className="dropdown-menu-list scroller"
                        data-handle-color="#637283"
                    >
                        {this.props.notifications.map(notification => {
                            return (
                                <NotificationLI
                                    key={notification._id}
                                    notification={notification}
                                />
                            );
                        })}
                    </ul>
                </li>
            </ul>
        );
    }

    /**
     * Set the wrapper ref
     */
    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.dispatch({
                type: "Dashboard-toggleDropdown_reducer",
                action: "hide"
            });
        }
    }
}

function mapStatesToProps(state) {
    if (state.dashboard && state.dashboard.showDropdown) {
        return {
            showDropdown: state.dashboard.showDropdown,
            notifications: state.dashboard.notifications
                ? state.dashboard.notifications
                : [],
            count: state.dashboard.count ? state.dashboard.count : 0,
            unreadcount: state.dashboard.unreadcount
                ? state.dashboard.unreadcount
                : 0
        };
    }
}

export default connect(mapStatesToProps)(Notifications);
