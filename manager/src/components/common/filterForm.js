/**
 * FilterForm this component propvides value of the redux form on submiting theform
 * @prop submitFunction:-required , Type Function it will return the redux form data 
 *         in the first argument of this function. This is the submit function of the
 *         parent component.
 */

import React,{Component} from "react";
import {connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';

/**custom components made in libs */
import DropdownComp from "./DropdownList";
import DatePicker  from "./DateTimePicker";
import RenderField from "./renderField";
import {ValidateOnlyAlpha}from "./fieldValidations";
import Loader from "./loader";


class FilterForm extends Component {

    render(){

        const { handleSubmit, submitting,  invalid, loader,
             roleOptions, internal, submitFunction,reset,
            statusComp, sortByComp, limitComp, roleComp, searchPlaceholder, hideDateComp} = this.props; 
        return(
            <div>
                {loader && !roleOptions ? <Loader /> :
                    <div>
                        <form onSubmit={handleSubmit(submitFunction)}  >

                            <div className='col-sm-3'>
                                {/**search */}
                                <Field name="searchQuery" fieldName="&nbsp;" placeholder={searchPlaceholder || "Search"} component={RenderField} valiadte={[ValidateOnlyAlpha]} />
                            </div>
                            {/* DatePicker */}
                            {!hideDateComp &&
                                <div >
                                    <div className='col-sm-3'>
                                        <Field name="startDate" component={DatePicker} fieldName="From" />
                                    </div>
                                    <div className='col-sm-3'>
                                        <Field name="endDate" min={internal ? internal : undefined} component={DatePicker} fieldName="To" />
                                    </div>
                                </div>}

                            {/* status active in active Dropdown    */}
                            {statusComp && <div className='col-sm-3'>
                                <Field name="filter"
                                    options={[{ label: "All", value: "2" }, { label: "Active", value: "1" }, { label: "In-active", value: "0" }]}
                                    label="Filter"
                                    textField="label"
                                    valueField="value"
                                    component={DropdownComp}
                                /></div>}

                            {/* Sort By DropdownComp */}
                            {sortByComp && <div className='col-sm-3 clr-both'> <Field name="sortBy"
                                options={[{ label: "Created At", value: "created_at" }, { label: "Name", value: "firstname" }]}
                                label="Sort By"
                                textField="label"
                                valueField="value"
                                component={DropdownComp}
                            /></div>}

                            {/* limit DropdownComp */}
                            {limitComp && <div className='col-sm-3'><Field name="limit"
                                options={[{ label: "10", value: 10 }, { label: 15, value: 15 }, { label: 20, value: 20 }]}
                                label="Results Per Page"
                                textField="label"
                                valueField="value"
                                component={DropdownComp}
                            /></div>}

                            {roleComp && <div className='col-sm-3'><Field name="roleId"
                                options={roleOptions}
                                component={DropdownComp}
                                textField="title"
                                valueField="_id"
                                label="Role Name"
                            /></div>}

                            <div className="form-actions filter-actions">
                                <div className='col-sm-6'> <button type="submit" className="btn green uppercase" disabled={invalid || submitting}>Submit</button></div>
                                {/* Reset Form  */}
                                <div className='col-sm-6'> <button type="button" className="btn " onClick={reset}>Reset</button></div>
                            </div>
                        </form><br />
                    </div>}
            </div>
        )
    }

}

/**to apply field level validation */
let Filters_Form = reduxForm({
    form: "Filter_Form",
    validate: (values) => {
        const errors = {};
        /**check if user selected value of either startDate or endDate */
        if (values.startDate || values.endDate) {
            /**throw error if user not selected start Date */
            if (!values.startDate) errors.startDate = "Required";
            /**throw error if user not selected end Date */
            else if (!values.endDate) errors.endDate = "Required";
        }
        return errors;
    }
})(FilterForm);

/**to send value  of start date in props */
const selector = formValueSelector('Filter_Form');

let mapstateToProps = (state)=>({
    /**to get value of dropdown */
     internal : selector(state, 'startDate')
})
/**to check for the props */
Filters_Form.propTypes = {
    submitFunction: PropTypes.func.isRequired,
};
export default connect(mapstateToProps)(Filters_Form);