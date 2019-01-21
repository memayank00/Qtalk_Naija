import React, { Component } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import $script from 'scriptjs';
import {sitekey} from "../../utils/env"

class Captcha extends Component {

    constructor(props){
        super(props);

        this.state = {
            grecaptcha: null,
        };
        this.getCaptchaValue = this.getCaptchaValue.bind(this);
    }
    /**this hook will run after the component is mounted*/
    componentDidMount() {
        $script('https://www.google.com/recaptcha/api.js', () => {
            window.grecaptcha.ready(() => {
                this.setState({
                    grecaptcha: window.grecaptcha,
                });
            });
        });
    }
    /**to send value in parent component */
    getCaptchaValue(value) {
        /**to send value in redux */
        this.props.input.onChange(value);
    }

    render(){
        const { grecaptcha} =this.state;
        return(<div>
            <ReCAPTCHA
                ref="recaptcha"
                sitekey={sitekey}
                onChange={this.getCaptchaValue}
                grecaptcha={grecaptcha}
            />
        </div>         
        )
    }
}
export default Captcha;