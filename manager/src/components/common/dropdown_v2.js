import React, { Component } from 'react';
import { DropdownList } from 'react-widgets';
import { FormGroup, Col, FormFeedback, FormText } from 'reactstrap';
import { HelpBlock } from "react-bootstrap";
import "react-widgets/dist/css/react-widgets.css";
/**
 *Dropdown needs following props
 * label :-to show label of dropdown 
 * options:-options of dropdown must be an array
 * name :- by which it will create field
 * defaultValue :- to show default value on dropdown
 * textField :-to show text on dropdown
 * valueField :- corresponding value
 */

class Dropdown extends Component {
    constructor(props){
        super(props);

        /**event binding */
        this.updateValue = this.updateValue.bind(this);
    }

    render() {
        const { input, textField, valueField, options, readOnly, label, labelClass, hintText,
            meta: { touched, error },placeholder, md, lg, sm, xs } = this.props;       
        let formgroup = <FormGroup >
            {label && <label className={labelClass} >{label}</label>}           
            <DropdownList
                // {...input}
                data={options}
                defaultValue={input.value ? input.value:undefined}
                name={input.name}
                textField={textField}
                valueField={valueField}
                onChange={this.updateValue}
                value={input.value ? input.value : undefined}
                placeholder={placeholder}
                readOnly={readOnly?true:false}
            />           
            <HelpBlock style={{ color: '#e73d4a' }}>
                {touched && error ? error : null}
            </HelpBlock>
            {/* <FormFeedback >{error}</FormFeedback> */}
            {hintText && <FormText>{hintText}</FormText>}
        </FormGroup>


        if (!(md || lg || sm || xs)) return formgroup;
        else return (<Col md={md} lg={lg} xs={xs} sm={sm || 12}>{formgroup}</Col>);
    }

    updateValue(newValue) {
        /** redux onchange method  */
        /**to send only value on server */  
        const { valueField,input,fullObj}=this.props;
        input.onChange(fullObj ?newValue:newValue[valueField]);
    }
}

export default Dropdown;