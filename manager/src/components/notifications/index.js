import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import Http from '../../services/http';


class Notifications extends React.Component{
    constructor(props){
        super(props);
        /** init state */
        this.state = { page : 1, notifications : [], showLoadMore:true };
        /**bind this */
        this.loadMore = this.loadMore.bind(this);
    }

    componentWillMount(){
        /*get notifications of user when user data available*/
        this.loadMore();
    }

    

    render(){
        
        return(
            <div>
                <ul className='feeds'>
                    {this.state.notifications.map((notification, i) => {
                        return(
                            <div key={notification._id}>
                                <li>
                                    <div className="col1">
                                        <div className="cont">
                                            <div className="cont-col1">
                                                <div className={`label label-sm label-${notification.metadata && notification.metadata.color ? notification.metadata.color :"info" }`}>
                                                    <i className={`fa fa-${notification.metadata && notification.metadata.icon ? notification.metadata.icon :"bullseye"}`}></i>
                                                </div>
                                            </div>
                                            <div className="cont-col2">
                                                <div className="desc"> {notification.title}
                                                    {notification.metadata && notification.metadata.link &&
                                                        <span className="label label-sm label-primary pull-right">
                                                            <i className="fa fa-link"></i>
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col2">
                                        <div className="date label label-info"><i className='fa fa-clock-o'></i> <Moment format='DD MMM YYYY hh:mm A'>{notification.createdAt}</Moment> </div>
                                    </div>
                                </li>

                                {(i+1)%10===0 && <hr />}
                            </div>
                        );
                    })}

                </ul>
                
                {this.state.showLoadMore ? <div className='text-center'> <br/>
                    <span className='label label-primary pointer' onClick={this.loadMore}>Load More <i className='fa fa-refresh'></i></span>
                </div> : <div className='text-center'> <br />
                    <span className='label label-default'>You've reached to end of the page.</span>
                </div>}
            </div>
        );
    }

    /**
     * load notificaitons in a slot of 10
     */
    loadMore(){
        let {page} = this.state,
        data = { page: page, limit: 10 };

        Http.Request("get", window.admin.getNotifications, data)
        .then(response => {
            /** if notifications greater than 10 then show load more button else hide it */
            if (response.data.notifications && response.data.notifications.length<10){
                this.setState({showLoadMore: false});
            }

            this.setState({ page: this.state.page+1, notifications: this.state.notifications.concat(response.data.notifications)});
        })
        .catch(error => console.log(error));
    }

}

/** Map States to Props */
function mapStateToProps(state){
    return({
        notifications: state.dashboard.notifications ? state.dashboard.notifications : [],
        count: state.dashboard.count ? state.dashboard.count : 0
    });
}

export default connect(mapStateToProps)(Notifications);