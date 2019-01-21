import React, { Component } from 'react';
import { Field, reduxForm} from 'redux-form';
import { toast } from 'react-toastify';
import HTTP from "../../services/http";
import {Alert } from "react-bootstrap";

/**COMPONENT */
import CreatableDemo from "../common/createTag"
import PageHeader from "../common/pageheader";
import Loader from "../common/loader";
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
import infoOf from '../common/tooltip-text';

class IPManagment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        }
        /**event binding  */
        this.addEditIP = this.addEditIP.bind(this);
        this.getIPS = this.getIPS.bind(this);
    }

    componentWillMount() {
        /**to get data from DB */
        this.getIPS()
    }

    render() {
        const { handleSubmit } = this.props;
        const { isLoading ,savedIPS } = this.state;
        return (
            <div>
                {isLoading ? <Loader /> : <div><PageHeader pageTitle="IP Management"  route="IP Management" />
                    <div className="tab-pane active" >   
                        <Alert bsStyle="info">
                            <strong>NOTE : </strong> WhiteList's IP Addresses  priority is higher than BlackList IP Addresses
                        </Alert>
                        {/* Form begin */}
                        <form onSubmit={handleSubmit(this.addEditIP)}  >
                            <Field name="whiteList" icon='fa fa-info-circle' tooltip={infoOf.ip_whitelist} fieldName="WhiteList IP" savedIP={savedIPS.whiteList} component={CreatableDemo} />   
                            <Field name="blackList" icon='fa fa-info-circle' tooltip={infoOf.ip_blacklist} fieldName="BlackList IP" savedIP={savedIPS.blackList} component={CreatableDemo}  />                         
                            <br />                           
                            <div className="form-actions">
                                <button type="submit" className="btn green uppercase" disabled={this.props.invalid ||  this.props.submitting}>Submit</button>
                            </div>
                        </form>
                        {/* Form end */}
                    </div>
                </div>
                }
            </div>
        );
    }

    /**to upset black and white IP */
    addEditIP(data) {
        /**set parameters */
        let obj = {};
        obj.meta_key = "IPManage";
        obj.meta_value = data
        /**to start loader */
        // this.setState({ isLoading: true })
        /**call api to post new data */
        HTTP.Request("post", window.admin.addEditMetaData, obj)
        
        .then(result =>  {
            /** stop loader */
            // this.setState({ isLoading: false });
            /**show toaster message*/
            toast(result.message,{type:"success"});
            /*log audits for user*/
			this.props.dispatch({
				type: ADMIN_TRACK_AUDIT_LOGS,
				action: {
					comment: "Modified IP Rules",
					type: "audit"
				}
			});
        } )
        .catch(err => {
            console.log("err", err);
            /**to stop loader */
            this.setState({ isLoading: false })
        });
    }
       
    /**to get saved ip addresses */
    getIPS() {
        const params = { meta_key: "IPManage" };
        /**start loader */
        this.setState({ isLoading: true })
        HTTP.Request("get", window.admin.getMetaData,params)
        .then(result => {
            /**to stop Loader and set data in state*/
            this.setState({ isLoading: false, savedIPS: result.data.meta_value});
        })
        .catch(err => { this.setState({ isLoading: false });console.log("err-----",err)})
    }
    
}

//decorate form component
let addEditIPS_Form = reduxForm({
    form: "IPmanagment_Form ",
})(IPManagment);

export default addEditIPS_Form;