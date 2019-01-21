import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import {  toast } from 'react-toastify';

/**ACTIONS */
import { ADMIN_PROFILE_UPDATE, ADMIN_TRACK_AUDIT_LOGS} from "../../common/actions";
import { required, emailValiadte, minLengthValidate, mobileValidate} from "../../common/fieldValidations";
import RenderFiled from "../../common/renderField";
import Loader from "../../common/loader";
import HTTP from '../../../services/http';
import Session from "../../../services/session";

class PersonalInfo extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading:false
        }
        /**event binding  */
        this.editPersonalInfo = this.editPersonalInfo.bind(this);

    }

    componentWillMount(){

        /**To initalized personal ifo data in redux form */
        const { initialize,personalInfo } = this.props;
        initialize(personalInfo);
    }
    render() {

        const { handleSubmit } = this.props;
        const {isLoading } = this.state;
        return (
            <div> 
                
                <div className="tab-pane active" >

                    {isLoading ? <div className="min-height500"><Loader /></div> :<form onSubmit={handleSubmit(this.editPersonalInfo)}  >                     
                        <Field name="firstname" fieldName='First Name*' type="text" placeholder='First Name' component={RenderFiled} validate={[required, minLengthValidate]} />
                        <Field name="lastname" fieldName='Last Name*' type="text" placeholder='Last Name' component={RenderFiled} validate={[required, minLengthValidate]} />
                        <Field name="username" fieldName='Username*' type="text" placeholder='Username' component={RenderFiled} validate={[required, minLengthValidate]} />
                        <Field name="email" fieldName='Email*' type="text" placeholder='abc@yourdomain.com' component={RenderFiled} validate={[emailValiadte, required]} />
                        <Field name="mobile" fieldName='Mobile No.*' type="number" placeholder='9999999999' component={RenderFiled} validate={[mobileValidate, required]} />                      
                        <div className="form-actions">
                            <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>Save Changes</button>         
                        </div>
                    </form> }                 
                </div>
            
            </div>
        );
    }

    editPersonalInfo(data) {
        /**add _id of user in data */
        data._id = this.props.personalInfo._id;
        this.setState({isLoading:true})
        HTTP.Request("post", window.admin.addEditUser, data)
        .then(result => {          
            toast(result.message,{type:"success"});
            this.setState({isLoading:false});
            /** to update our cookies  */
            Session.setSession("user", result.data);
            /** to update state so all the connected components 
             * update automatically
             */
            this.props.dispatch({
                type:ADMIN_PROFILE_UPDATE,
                data:result.data
            });
            /*log audits for user*/
            this.props.dispatch({
                type: ADMIN_TRACK_AUDIT_LOGS,
                action: {
                    comment: "Changed Personal Details",
                    type: "audit"
                }
            });
        })
        .catch(err => {
            this.setState({ isLoading: false })
            if (err && err.error.length > 0)
                err.error.map(message => toast(message,{type:"error"}))
        })
    }
}


let PersonalInfo_Form = reduxForm({
    form: "edit_personal_info"
})(PersonalInfo);

//decorate form component
function mapStateToProps(state) {
    return ({
        personalInfo: state.admin.user
    });
}

export default connect(mapStateToProps)(PersonalInfo_Form);
