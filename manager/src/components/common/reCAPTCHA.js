import React, { Component } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import {sitekey} from "../../utils/env/env"

class Captcha extends Component {

    constructor(props){
        super(props);

        this.getCaptchaValue = this.getCaptchaValue.bind(this);
    }

    getCaptchaValue(value ){    
        /**to send value in redux */
        this.props.input.onChange(value);   
    }

    render(){
        return(<div>
            <ReCAPTCHA
                ref="recaptcha"
                sitekey={sitekey}
                onChange={this.getCaptchaValue}
                
            />
        </div>         
        )
    }
}

export default Captcha;