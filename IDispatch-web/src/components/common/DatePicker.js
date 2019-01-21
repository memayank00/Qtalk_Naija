import React from 'react';
import { DateTimePicker } from 'react-widgets';
import {HelpBlock} from"react-bootstrap";
import momentLocaliser from 'react-widgets-moment';
import moment from 'moment';
import { FormGroup, Col, FormFeedback, FormText } from 'reactstrap';
import "react-widgets/dist/css/react-widgets.css";
class DatePicker extends React.Component {
    constructor(props){
        super(props)
        momentLocaliser(moment) ;
    }
  
    render(){
        const { input, showTime, readOnly, label, labelClass, hintText, placeholder ,
            meta: { touched, error }, min, md , lg , sm , xs} = this.props;         

        let formgroup = <FormGroup >
            {label && <label className={labelClass} >{label}</label>}
            <DateTimePicker
                {...input}
                onChange={input.onChange}
                format="DD MMM YYYY"
                time={showTime ? true : false}
                value={!input.value ? undefined : new Date(input.value)}
                max={new Date()}
                min={min}
                readOnly={readOnly?true:false}
                placeholder={placeholder}
            />
            <HelpBlock style={{ color: '#e73d4a' }}>
                {touched && error ? error : null}
            </HelpBlock>
            <FormFeedback >{error}</FormFeedback>
            {hintText && <FormText>{hintText}</FormText>}
        </FormGroup>


        if (!(md || lg || sm || xs)) return formgroup;
        else return (<Col md={md} lg={lg} xs={xs} sm={sm || 12}>{formgroup}</Col>);       
    }
}

export default DatePicker ;