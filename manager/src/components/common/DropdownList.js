import React, { Component } from 'react';
import { DropdownList } from 'react-widgets';
/**
 *DropdownComp needs following props
 * label :-to show label of dropdown 
 * options:-options of dropdown must be an array
 * name :- by which it will create field
 * defaultValue :- to show default value on dropdown
 * textField :-to show text on dropdown
 * valueField :- corresponding value
 */

class DropdownComp extends Component {
    constructor(props){
        super(props);

        /**event binding */
        this.updateValue = this.updateValue.bind(this);
    }
    render(){
        const { input:{name,value}, options, defaultValue, label, textField, valueField} = this.props; 
        return (<div>
            <label>{label}</label>
            <DropdownList   
                data={options}
                defaultValue={defaultValue}
                name={name}
                textField={textField}
                valueField={valueField}
                onChange={this.updateValue}        
                value={value ? value:undefined }
            />
        </div>
           
        )
    }

    updateValue(newValue) {
        /** redux onchange method  */
        /**to send only value on server */  
        const { valueField}=this.props;
        this.props.input.onChange(newValue[valueField]);
    }
}

export default DropdownComp;