import React, {Component} from 'react';
import { required } from './fieldValidations';
import { Field } from 'redux-form';
import renderField from "./renderField";
import TT from "./tooltip";


class FieldArrayfeature extends Component {
	render() {
		const { placeholder1, formGroupClassName,fields,feature} = this.props;
		
		return (
		  <div className={formGroupClassName}>
		    <div className='m-bot-30'>
		    <TT tooltip='Add New Feature'>
			         <button
			          type="button"
			          className="btn btn-md green"
			          onClick={() => fields.push()}
			          >
								<i className="fa fa-plus"></i>
			         </button>
							</TT>
		    </div>
		    {fields.map((value, index) =>
		       <div key={index} className="form-row row">
		       
		       		<div className='col-sm-10'>
			        <Field
			          name={`${value}`}
			          type="text"
			          component={renderField}
			          placeholder={placeholder1}
						validate={[required]}
				  		fieldName={feature}
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

export default FieldArrayfeature;