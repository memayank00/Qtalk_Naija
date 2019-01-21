import React, { Component } from 'react';
/**props type checking */
import PropTypes from 'prop-types';
import { FormGroup, FormFeedback, FormText } from 'reactstrap';

class FileInput extends Component {
    constructor(props) {
        super(props);
        this.getFile = this.getFile.bind(this);
    }

    /**get file */
    getFile(e) {
        this.props.input.onChange(e.target.files[0]);
    }
    render() {
        const { input, label, checkBoxValue, labelClass } = this.props;
        return (
            <input className='form-control' type="file" onChange={this.getFile} accept="image/*" />
        )
        
    }
    /**this hook will run after component mounted in DOM
     * here we are using this hook to run onchange function of redux field initally 
     * to send value */
    // componentDidMount() {
    //     const { checkBoxValue, input } = this.props;
    //     /**send value to redux field if checkbox is checked*/
    //     if (document.getElementById(checkBoxValue).checked) input.onChange(checkBoxValue);
    //     /**on uncheck send null */
    //     else input.onChange(null);
    // }

}
/**to check datatype of props */
// FileInput.propTypes = {
//     checkBoxValue: PropTypes.string.isRequired,//value return by the checkbox
//     labelClass: PropTypes.string,//css calss want to apply on the label of checkbox
//     label: PropTypes.string,//label of the checkbox
//     input: PropTypes.object.isRequired,//this object will be given by redux form
// };
// FileInput.defaultProps = {
//     /**default css class of checkbox label */
//     labelClass: "dashboard-checkbox-container"
// };
export default FileInput;