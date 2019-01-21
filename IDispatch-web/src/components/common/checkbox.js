import React, { Component } from 'react';
/**props type checking */
import PropTypes from 'prop-types';

class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
    }
    /**this function will called if the state of checkbox changes */
    change(data) {
        const { checkBoxValue, input } = this.props;
        /**send value to redux field if checkbox is checked*/
        if (document.getElementById(checkBoxValue).checked) input.onChange(checkBoxValue);
        /**on uncheck send null */
        else input.onChange(null);
    }
    render() {
        const { input, label, checkBoxValue, labelClass } = this.props;
        return (
            <label className={labelClass}>{label}
                <input id={checkBoxValue} type="checkbox" onChange={this.change}
                    value={checkBoxValue} checked={input.value ? true : false} />
                <span className="checkmark"></span>
            </label>
        )

    }
    /**this hook will run after component mounted in DOM
     * here we are using this hook to run onchange function of redux field initally 
     * to send value */
    componentDidMount() {
        const { checkBoxValue, input } = this.props;
        /**send value to redux field if checkbox is checked*/
        if (document.getElementById(checkBoxValue).checked) input.onChange(checkBoxValue);
        /**on uncheck send null */
        else input.onChange(null);
    }

}
/**to check datatype of props */
CheckBox.propTypes = {
    checkBoxValue: PropTypes.string.isRequired,//value return by the checkbox
    labelClass: PropTypes.string,//css calss want to apply on the label of checkbox
    label: PropTypes.string,//label of the checkbox
    input: PropTypes.object.isRequired,//this object will be given by redux form
};
CheckBox.defaultProps = {
    /**default css class of checkbox label */
    labelClass: "dashboard-checkbox-container"
};
export default CheckBox;