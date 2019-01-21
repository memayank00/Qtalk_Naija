import React, { Component } from 'react';

/**COMPONENTS */
import PageHeader from "../common/pageheader";
import Rectangle from "./element/rectangle"

/**PAGE LEVEL CSS */

class Dashboard extends Component {

    render() {
        
        return (
            <div> 
                <PageHeader pageTitle="Admin Dashboard " route="Dashboard" />
                <h1 >Todays Statistics</h1>
                <br/>
                <div className="row">
                    <Rectangle color="blue" icon="fa fa-comments" value={0} title="Market Leads"  />
                    <Rectangle color="red-mint" icon="icon-basket" value={0} title="Out Of Market Leads" sign="M$" />
                    <Rectangle color="green" icon="fa fa-shopping-cart" value={0} title="Reviews"  />
                    {/* <Rectangle color="purple" icon="fa fa-globe" value={0} title="Sample Kit"  /> */}
                </div>

            </div>
        );
    }

}


export default Dashboard;

