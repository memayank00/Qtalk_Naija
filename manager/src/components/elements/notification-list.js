import React from 'react';
import Moment from "react-moment";

/*Custom components*/

export default class NotificationLI extends React.Component{
	render(){
        let notification = this.props.notification;
		/*rendering the view for notifications*/
		return(
            <li className={notification.read?'read':'unread'}>
                <a href="#">
                    <span className="time"><Moment format="DD MMM YYYY">{notification.created_at}</Moment></span>
                    <span className="details">
                    <span className="label label-sm label-icon label-success">
                    </span> {notification.title} </span>
                </a>
            </li>
		);
	}
}