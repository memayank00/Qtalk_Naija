import React, { Component } from 'react';
import { required } from '../../common/fieldValidations';
import { Field } from 'redux-form';
import { Panel, Table } from "react-bootstrap";
import renderField from "../../common/renderField";

class FieldArrayComp extends Component {
    render() {
        const { formGroupClassName, fields } = this.props;
        return (
            <div className={formGroupClassName}>
                <Panel bsStyle="info">
                    <Panel.Heading>Price</Panel.Heading>
                    <Panel.Body>
                        <Table responsive striped bordered condensed hover>
                            <thead>
                                <tr>
                                    <th>Customer Type</th>
                                    <th>Price*</th>
                                    <th>Discounted Price*</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((value, index) =>
                                    < tr key={index} >
                                        <td> <Field
                                            name={`${value}.type`}
                                            type="text"
                                            component={renderField}
                                            validate={[required]}
                                            readOnly                      
                                        /></td>
                                        <td> <Field
                                            name={`${value}.price`}
                                            type="number"
                                            component={renderField}
                                            placeholder="Enter Price"
                                            validate={[required]}                     
                                        /></td>
                                        <td> <Field
                                            name={`${value}.discountedPrice`}
                                            type="number"
                                            component={renderField}
                                            placeholder="Enter Discounted Price"
                                            validate={[required]}                     
                                        /></td>
                                    </tr>
                                 )}
                            </tbody>
                        </Table>
                        
                    </Panel.Body>
                </Panel>
                
            </div>
        )
    }
}


export default FieldArrayComp;