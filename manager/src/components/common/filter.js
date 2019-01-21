import React from 'react';
import  DateTimePicker from '../common/DateTimePicker';
import {HelpBlock} from"react-bootstrap";
import { Field, reduxForm,  formValueSelector } from 'redux-form';
import {connect} from 'react-redux';
import moment from 'moment';
import { required, ValidateOnlyAlpha,slugValidation } from '../common/fieldValidations';
class DateFilter extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading:false,
            formAction :"ADD",
            status:true,
            state_date:new Date()
        }

        /**event bind  */
        this.handleChange = this.handleChange.bind(this)
       
    }
    handleChange(e){
        this.props.input.onChange(e);
    }
    
    render(){
        const { handleSubmit,min,max,invalid,reset,submitting,filterByDate} = this.props;
        
        return(
            <div>

            <form  onSubmit={handleSubmit(filterByDate)}>
                <div className="row">
                        <div className='col-sm-3'>
                            <Field 
                            name="start_date" 
                            max={max} 
                            component={DateTimePicker} 
                            fieldName="From"  
                            />
                        </div>
                        <div className='col-sm-3'>                               
                            <Field 
                            name="end_date"
                            min={min} 
                            fieldName="To" 
                            component={DateTimePicker}  
                           />
                        </div>
                        <div className="form-actions filter-actions">
                                <div className='col-sm-6'> <button type="submit" className="btn green uppercase" disabled={invalid || submitting}>Submit</button></div>
                                {/* Reset Form  */}
                                <div className='col-sm-6'> <button type="button" className="btn " onClick={reset}>Reset</button></div>
                            </div>
                </div>
            </form><br/>
            </div>
        )
    }


}


//decorate form component
let Date_Form = reduxForm({
    form: "Date_Form",
    validate: (values) => {
        const errors = {};
        /**check if user selected value of either startDate or endDate */
        if (values.start_date || values.end_date) {
            /**throw error if user not selected start Date */
            if (!values.start_date) errors.start_date = "Required";
            /**throw error if user not selected end Date */
            else if (!values.end_date) errors.end_date = "Required";
        }
        return errors;
    }
})(DateFilter);


const selector = formValueSelector('Date_Form')
 let mapStateToProps = (state) =>{
    const min = selector(state, 'start_date')
    const max = selector(state, 'end_date')
    return {min,max}
 }


export default connect(mapStateToProps)(Date_Form)  ;