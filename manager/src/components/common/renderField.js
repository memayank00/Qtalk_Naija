import React, { Component } from 'react';
import {  FormGroup, FormControl, HelpBlock } from 'react-bootstrap';
import PlacesAutocomplete from 'react-places-autocomplete';
/**components... */
import TT from './tooltip';

class RenderField extends Component {
  
    render(){   
        const { input, label, type, textarea, fieldName,rows, placeholder, meta:{ asyncValidating, touched, error }, className,readOnly, icon, tooltip,onSelect,placesAutocomplete ,maxLength}  = this.props;
        console.log("=>",{props:this.props})
        return (
            <FormGroup validationState={!touched ? null : (error ? "error" : "success")}>
                <label>{fieldName}
                    <TT tooltip={tooltip || null}> {icon && <i className={icon}></i>} </TT>
                </label>
                <div className={asyncValidating ? 'async-validating' : null}>
                <FormControl
                    { ...input}
                    maxLength={maxLength ? maxLength:''}
                    placeholder={placeholder ? placeholder : ''}
                    type={type ? type : "text"} 
                    readOnly={readOnly}
                    componentClass={textarea ?"textarea":"input"}
                    rows={rows ? rows:''}
                    /> 
                </div>
                <HelpBlock>
                    {touched && error ? error : null}
                </HelpBlock>
            </FormGroup>
        );
    }
    
}

export default RenderField;