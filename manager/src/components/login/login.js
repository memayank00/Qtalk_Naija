import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { connect } from "react-redux";

/**SERVICES */
import Session from "../../services/session";

import Socket from "../../sockets";

/**COMPONENTS */
import { required } from "../common/fieldValidations";
import RenderFiled from "../common/renderField";

import Loader from "../common/loader";
import { Check_For_BlackList } from "../common/actions";

import HTTP from "../../services/http";

/**CSS */
import "../../assets/css/login.min.css";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };
        /*bind <this> with class methods*/
        this.loginnow = this.loginnow.bind(this);
        this.blacklist = this.blacklist.bind(this);
    }

    /*componentWillMount() {
        if (process.env.NODE_ENV === "production") {
            this.blacklist();
        }
    }*/
    render() {
        const { handleSubmit, validSession } = this.props;
        const { isLoading } = this.state;
        return (
            <div className="login">
                <div className="content ">
                    {/* <!-- BEGIN LOGIN FORM --> */}
                    {isLoading && <Loader />}
                    {validSession === "W" ? (
                        <form
                            id="login-form"
                            onSubmit={handleSubmit(this.loginnow)}
                            className="login-form"
                        >
                            <h3 className="form-title font-green">Sign In</h3>
                            <Field
                                name="email"
                                fieldName="Email/Username*"
                                type="text"
                                placeholder="Email"
                                component={RenderFiled}
                                validate={[required]}
                            />
                            <Field
                                name="password"
                                fieldName="Password*"
                                type="password"
                                placeholder="Password"
                                component={RenderFiled}
                                validate={[required]}
                            />
                            {/**CAPTCHA */}
                            {/* <Field name="captcha"  component={Captcha} validate={[required]} />  */}

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn green uppercase"
                                    disabled={
                                        this.props.invalid ||
                                        this.props.submitting
                                    }
                                >
                                    Login
                                </button>
                                <Link
                                    to="/forgot-password"
                                    id="forget-password"
                                    className="forget-password"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <h3>You are not allowed to access this page.</h3>
                            {validSession !== "B" && (
                                <center>
                                    {" "}
                                    Are you the Site Owner? <br />
                                    <small>
                                        <Link
                                            to="/request-access"
                                            id="request-access"
                                        >
                                            Click here to get the Access!
                                        </Link>
                                    </small>
                                </center>
                            )}
                        </div>
                    )}

                    {/* <!-- END LOGIN FORM --><div>
                        <h3>You are not allowed to access this page.</h3> 
                        <center> Are you the Site Owner? <br> <small> <a onClick="+this.getAccess()+">Click here to get the Access!</a> </small> </center>
                    </div> */}
                </div>
            </div>
        );
    }

    loginnow(data) {
        const { dispatch } = this.props;
        this.setState({ isLoading: true });
        dispatch({
            type: "Admin-login",
            data: data,
            success: r => {
                console.log("resull=>",r)
                if (!r) return false;
                //this.setState({ isLoading: false });
                /*set user session in cookie*/
                Session.setSession("token", r.token);
                Session.setSession("user", r.data);
                Session.setSession("permissions", r.permissions);

                Socket.callEvent("login", { userId: r.data._id });

                /*log audits for user*/
                dispatch({
                    type: "Admin-trackAuditLogs",
                    action: {
                        comment: "Successfully Logged In",
                        type: "audit"
                    }
                });
            },
            error: e => {
                console.log("error==>",e)
                this.setState({ isLoading: false });
                /*for popup */

                toast(e.message, { type: "error" });
                /**to reset captcha */
                // window.grecaptcha.reset();
                /**to clear value in the captcha filed of redux form */
                // dispatch(change('login', 'captcha', null));

                /**
                 * REFRENCE
                 * import {change} from 'redux-form';
                 * dispatch(change('myForm', 'myField', 'newValue'))
                 */
            }
        });
    }

    blacklist() {
        const { dispatch } = this.props;
        HTTP.Request("get", window.admin.validateSession)
            .then(result => {
                /**dispatch an action for setting value in store */
                dispatch({
                    type: Check_For_BlackList,
                    data: result.__ack
                });
            })
            .catch(err => false);
    }
}

//decorate form component
let LoginForm = reduxForm({
    form: "login"
})(Login);

function mapStatesToProps(state) {
    return {
        validSession: state.admin ? state.admin.blacklistIp : false
    };
}

export default connect(mapStatesToProps)(LoginForm);
