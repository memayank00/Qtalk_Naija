import React, { Component } from 'react';
import { FormGroup, Input, Col, FormFeedback, FormText } from 'reactstrap';

class RenderField extends Component {
  
    render(){   

        const { button, input, readOnly, textarea,asyncValidating, label,text, labelClass, hintText, type, placeholder, meta: { touched, error }, sm, md, lg, xs, formGroupClassName}  = this.props;         
        /**checkbox */
      
        let checkBoxType =
            <label className={labelClass}  >
                <Input
                    invalid={touched && error ? true : undefined}
                    {...input}
                    type="checkbox"
                    placeholder={placeholder}                    
                    readOnly={readOnly} />
                    {label}
                {touched && error && <FormFeedback >{error}</FormFeedback>}
                {hintText && <FormText>{hintText}</FormText>}
            </label>
       
        /**radio button */
        let radioButton =
            <label className={labelClass} >{label}
            {text && <text>{text}</text>}
                <Input
                    invalid={touched && error ? true : undefined}
                    {...input}
                    type="radio"
                    placeholder={placeholder}
                    readOnly={readOnly} />
                <span className="checkmark"></span>
                {touched && error && <FormFeedback >{error}</FormFeedback>}
                {hintText && <FormText>{hintText}</FormText>}
            </label>


        let formgroup = <div className={asyncValidating ? 'async-validating' : ''}>
            <FormGroup className={formGroupClassName} >
            {label && <label className={labelClass} >{label}</label>}              

            <Input
                invalid={touched && error ? true : undefined}
                {...input}
                type={type ? type : "text"}
                placeholder={placeholder}
                readOnly={readOnly} />
                {button}
                {touched && error && <FormFeedback >{error}</FormFeedback>}
                {hintText && <FormText>{hintText}</FormText>}               
           </FormGroup>
            
            
        </div>
        /**to return checkbox */
        if (type === "checkbox") return checkBoxType;
        if (type === "radio") return radioButton;

        if (!(md || lg || sm || xs) && type !== "checkbox") return formgroup;
       
        else return (<Col md={md} lg={lg} xs={xs} sm={sm||12}>{formgroup}</Col>);
    }
    
}

export default RenderField;