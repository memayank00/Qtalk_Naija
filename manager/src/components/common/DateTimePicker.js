import React from 'react';
import { DateTimePicker } from 'react-widgets';
import {HelpBlock} from"react-bootstrap";
import momentLocaliser from 'react-widgets-moment';
import moment from 'moment';
class DatePicker extends React.Component {
    constructor(props){
        super(props)
        momentLocaliser(moment) ;

        /**event bind  */

        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(e){
        this.props.input.onChange(e);
    }
    render(){
        const { input: { value }, showTime,meta:{invalid,error,touched},fieldName, min,max} =this.props
        return(
            <div className="section form-group">
                <label>{fieldName}</label>
                <DateTimePicker
                    onChange={this.handleChange}
                    format="DD MMM YYYY"
                    time={showTime ? true : false}
                    value={!value ? undefined : new Date(value)}
                    max={max ? max:new Date()}
                    min={min}
                   
                />
                <HelpBlock style={{ color: '#e73d4a' }}>
                 {/*    {touched && error ? error : null} */}
                    {invalid && error ? error : null}
                </HelpBlock>
            </div>
        )
    }
}

export default DatePicker ;