import React, { Component } from 'react';
import {FormControl, FormGroup, HelpBlock} from 'react-bootstrap';

class Formfield extends Component{
	render(){
		return(
			<FormGroup validationState={!props.meta.touched ? null : (props.meta.error?"error":"success")}>
				<label>{props.fieldName}</label>
				<FormControl {...props.input} type={props.type?props.type:"text"}/>
				<HelpBlock>
              		{props.meta.touched && props.meta.error ? props.meta.error : null}
				</HelpBlock>
			</FormGroup>
		);
	}
}
export default Formfield ;