import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

/**COMPONENTS */
import CustomerTable from "./customer/table";
import AdminUserTable from "./adminUser/table";
import PageHeader from "../common/pageheader";
import NotFound from "../404/404";

/**PAGE LEVEL CSS */
import "../../assets/css/profile.min.css";

class Reports extends Component {
 
    renderCopmonent(){
        const { match: { params },dispatch } = this.props;
        switch (params.type) {
            case "customer": return { comp: <CustomerTable {...this.props} />, route:"Customers", parentRoute:"/reports"}
                 break;
            case "user": return { comp: <AdminUserTable {...this.props} />, route: "Admin Users", parentRoute: "/reports" }
                break;

            default: return{ comp:false};
        }
        
    }
    render() {
        const {comp,route,parentRoute} =this.renderCopmonent();  
        /**return to 404 if no comp  found */
        if(!comp) return <NotFound />   
        
        return (
            <div>
                <PageHeader route={route} parent='Reports' parentRoute={parentRoute} />
                <div className="profile-content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="portlet light ">
                                <div className="portlet-title tabbable-line">                        
                                    {comp}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect()(Reports);

