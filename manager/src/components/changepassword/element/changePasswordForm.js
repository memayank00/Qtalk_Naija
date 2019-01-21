import React, { Component } from 'react';
import { Field, reduxForm,reset } from 'redux-form';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import HTTP from "../../../services/http";
import { required,password } from '../../common/fieldValidations';
import RenderFiled from "../../common/renderField";
import Loader from "../../common/loader";
import infoOf from "../../common/tooltip-text";
/**sockets */
import Socket from "../../../sockets";

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state={
            isLoading:false
        }
        /**event binding  */
        this.editPassword = this.editPassword.bind(this);
    }

    editPassword(data) {
        this.setState({ isLoading: true });
        HTTP.Request("post",window.admin.changePassword,data)
        .then(result => {
            this.setState({isLoading:false});
            /**to reset  changepassword form*/
            this.props.dispatch(reset('changePassword_Form')); 
            toast(result.message,{type:"success"});

            /**/
            /*log audits for user*/
            this.props.dispatch({
                type: "Admin-trackAuditLogs",
                action: {
                    comment: "Changed Account Password",
                    type: "audit"
                }
            });
            result.userId= this.props._id;
            Socket.callEvent("notified", result);
        })
        .catch(err => {
            this.setState({isLoading:false});
            toast(err.message,{type:"error"})
        });
    }


    render() {
        const { handleSubmit } = this.props;
        const {isLoading} =this.state;
        return (
            <div> 
                {isLoading && <Loader />}
                {/* <!-- START CHANGE PASSWORD --> */}
                <div className="tab-pane active" >
                    <form onSubmit={handleSubmit(this.editPassword)}  >
                        <Field name="currentPassword" icon="fa fa-info-circle" tooltip={infoOf.old_password} fieldName="Old password*" type="password"  component={RenderFiled} validate={[required]} />
                        <Field name="password" icon="fa fa-info-circle" tooltip={infoOf.new_password} fieldName='New Password*' type="password"  component={RenderFiled} validate={[required, password]} />
                        <Field name="cPassword" icon="fa fa-info-circle" tooltip={infoOf.confirm_password} fieldName='Confirm Password*' type="password"  component={RenderFiled} validate={[required]} />                        
                        <div className="form-actions">
                            <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>Update</button>
                        </div>
                    </form>
                </div>
                {/* <!-- END CHANGE PASSWORD --> */}

            </div>
        );
    }

}

//decorate form component
let changePassword_Form = reduxForm({
    form: "changePassword_Form",
    validate: function (values) {
        const errors = {};
        if (values.cPassword !== values.password) errors.cPassword = "Password mismatch";
        return errors;
    }
})(ChangePassword);

function mapStateToProps(state){
    return({
        _id : state && state.admin && state.admin.user ? state.admin.user._id :null
    });
}

export default connect(mapStateToProps)(changePassword_Form);