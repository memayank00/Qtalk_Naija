import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";
/**COMPONENTS */
import { required, emailValiadte } from "../common/fieldValidations";
import RenderFiled from "../common/renderField";

/**CSS */
import "../../assets/css/login.min.css";

class RequestAccess extends Component {

    constructor(props) {
        super(props);
        this.state = {isRequested:false};
        /*bind <this> with class methods*/
        this.getAccess = this.getAccess.bind(this);
    }
    render() {

        const { handleSubmit } = this.props;
        return (
            <div className='login'>
                <div className="content ">
                    <form onSubmit={handleSubmit(this.getAccess)} className="login-form" >
                        <h3 className="font-green">Request Access </h3>                        
                        
                        {!this.state.isRequested?<Field name="email" fieldName='Email*' type="email"  component={RenderFiled} validate={[required, emailValiadte]} />
                        :<Field name="otp" fieldName='Access Token*' type="text"  component={RenderFiled} validate={[required]} />}

                        <div className="form-actions">
                            <Link to="/login"><button type="button" className="btn green btn-outline">Back To Login</button></Link>
                            <button type="submit" className="btn btn-success uppercase pull-right" disabled={this.props.invalid || this.props.submitting}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    getAccess(data){
        if(!data.otp && data.email){
            /*User has requested for access token*/
            HTTP.Request("get", window.admin.requestAccess, data)
            .then(result => {
                this.setState({isRequested:true});
                toast(result.message,{type:"success"});
            })
            .catch(error => (error.errors && error.errors.length) ? (error.errors.map(e => toast(e,{type:"error"}))) : toast(error.message,{type:"error"}));
        }else{
            /**/
            HTTP.Request("get", window.admin.verifyAccessToken, data)
            .then(result => {
                this.props.dispatch(push("/login"));
                toast(result.message,{type:"success"});
            })
            .catch(error => (error.errors && error.errors.length) ? (error.errors.map(e => toast(e,{type:"error"}))) : toast(error.message,{type:"error"}));
        }
    }
}

//decorate form component
let request_form = reduxForm({
    form: "request_password"
})(RequestAccess);

export default request_form;