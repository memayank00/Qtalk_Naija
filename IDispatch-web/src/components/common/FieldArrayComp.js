import React, {Component} from 'react';
import { required } from './fieldValidations';
import { Field } from 'redux-form';
import renderField from "./renderField";
import TT from "./tooltip";

class FieldArrayComp extends Component {
	render() {
		const { placeholder1, placeholder2, formGroupClassName, fields} = this.props;
		return (
		  <div className={formGroupClassName}>
		    <div className='m-bot-30'>
		      <button type="button" className="btn-primary ml-1 btn btn-primary" onClick={() => fields.push()}>Add More</button>
		    </div>
		    {fields.map((value, index) =>
		       <div key={index} className="form-row row">
		       		<div className='col-sm-5'>
			        <Field
			          name={`${value}.pincode`}
			          type="text"
			          component={renderField}
			          placeholder={placeholder1}
								validate={[required]}
							  fieldName='Pincode*'
			          // doValidate={true}			          
			         />
			         </div> 
			         <div className='col-sm-5'>
						<Field
							name={`${value}.tax`}
							type="number"
							component={renderField}
							placeholder={placeholder2}
							fieldName='Tax*'
							validate={[required]}
						// doValidate={true}			          
						/>
					 </div>
			        <div className="col-md-2 col-lg-2 form-group">
			          <label>&nbsp;</label><br/>

							<TT tooltip='Remove'>
			         <button
			          type="button"
			          className="btn btn-md red-mint"
			          onClick={() => fields.remove(index)}>
								<i className="fa fa-trash no-pointer"  ></i>
			         </button>
							</TT>

			        </div> 
			    </div>     
		    )}
		  </div>
		)
	}
}

export default FieldArrayComp;