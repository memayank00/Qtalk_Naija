import React from 'react';
import TimePicker from 'react-times';
import moment from 'moment';
// import 'react-times/css/classic/default.css';
import 'react-times/css/material/default.css';

export default class SomeComponent extends React.Component {
    onTimeChange(options) {
      // do something
      this.props.input.onChange(options)
      // console.log("options-->",options)
    }
  
    onFocusChange(focusStatue) {
      // do something
        this.props.classForLate(focusStatue);
    }
  
    render() {
      const {input}=this.props;
      
     return (  
    
      <TimePicker
      theme="material"
      showTimezone={false}
      time={moment(input.value).format("HH:mm")}
      onFocusChange={this.onFocusChange.bind(this)}
      onTimeChange={this.onTimeChange.bind(this)}
    />
    
    )
    }
  }