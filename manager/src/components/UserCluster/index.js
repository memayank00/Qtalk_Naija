import React, { Component } from 'react';
import HTTP from '../../services/http';
/**COMPONENTS */
//import Table from "./element/table";
import PageHeader from "../common/pageheader";

/**PAGE LEVEL CSS */
import "../../assets/css/profile.min.css";
import PropTypes from 'prop-types';
import { GoogleApiWrapper } from 'google-maps-react';
import GoogleMap  from './GoogleMap';

class RoleManagement extends Component {
    constructor(props){
        super(props);
        this.state ={
            locations:[],
            isLoading:false,
            searchQuery :'',
            activePage :1,
            totalItemsCount:1
        }
        /**event binding */
        this.getActiveUser = this.getActiveUser.bind(this);

    }
   
    componentDidMount(){
         this.getActiveUser({page:1});
    }
    
    render() {
        const {match,history} = this.props;
        console.log("match componet-->",match)
        return (
            <div>
                <PageHeader route="User Cluster" />
                <div className="profile-content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="portlet light ">
                                <div className="portlet-title tabbable-line mapheight">
                                    {/* <Table {...this.props}/> */}
                                   {this.state.has&&<GoogleMap
                                        typeCheck={match}
                                        google={window['google']}
                                        locations={this.state.locations}
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    /**to get list of users */
    getActiveUser(params={}){
        /**to start Loader */
        this.setState({  isLoading: true }) 
        HTTP.Request("post",window.admin.getActiveUser,params)
        .then((response) =>{
            this.setState({locations:response.data ,has :true})
            console.log('response--- ',response)
             this.setState({
                array : response.data.users,
                isLoading:false,
                totalItemsCount: response.data.total
            })     
        })
    }
}


RoleManagement.propTypes = {
    google: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
  };
  RoleManagement.defaultProps = {
    google: null,
    settings: null,
  };
  

export default GoogleApiWrapper(props => ({
    apiKey: "AIzaSyA8aQ_1ntOgoUEndDMbc6gZeUdSGU_QBdw",
  }
  ))(RoleManagement);
// export default RoleManagement;



