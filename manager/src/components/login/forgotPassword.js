


import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';



/**COMPONENTS */
import { required, emailValiadte } from "../common/fieldValidations";
import RenderFiled from "../common/renderField";

/**CSS */
import "../../assets/css/login.min.css";

class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        /*bind <this> with class methods*/
        this.forgotpswd = this.forgotpswd.bind(this);
    }
    render() {

        const { handleSubmit } = this.props;
        return (
            <div className='login'>
                <div className="content ">
                    <form onSubmit={handleSubmit(this.forgotpswd)} className="login-form" >
                        <h3 className="font-green">Forget Password ?</h3>
                        <p> Enter your e-mail address below to reset your password. </p>
                        <Field name="email" fieldName='Email*' type="text" placeholder='Email' component={RenderFiled} validate={[emailValiadte, required]} />                   
                        <div className="form-actions">
                            <Link to="/login"><button type="button" className="btn green btn-outline">Back</button></Link>
                            <button type="submit" className="btn btn-success uppercase pull-right" disabled={this.props.invalid || this.props.submitting}>Submit</button>                           
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    forgotpswd(data) {
        this.props.dispatch({
            type: "Admin-Forgot-Password",
            data: data,
            success: (r) => {
                if (!r) return false;
                toast(r.message,{type:"success"})
            },
            error: (e) => {
                toast(e.message,{type:"error"})
            }
        })
    }
}

//decorate form component
let forgot_form = reduxForm({
    form: "forgot_password"
})(ForgotPassword);

export default forgot_form;

