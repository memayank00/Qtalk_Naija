import React, {Component} from 'react';
import { Field, FieldArray,reduxForm } from 'redux-form';
import { toast } from 'react-toastify';
import HTTP from "../../services/http";


/**COMPONENTS */
import renderField from "../common/renderField";
import FieldArrayComp from "../common/FieldArrayComp"; 
import { required } from '../common/fieldValidations';
import Loader from "../common/loader";
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
import infoOf from '../common/tooltip-text';


class Taxes extends Component {
	constructor() {
        super();
        this.state = {
            success: '',
			reset: false,
			isLoading:false
		}
		/**event binding */
		this.addEditTaxes = this.addEditTaxes.bind(this);
		this.getTaxes = this.getTaxes.bind(this);
	}
	componentWillMount(){
		/**to get values of saved Taxes*/
		this.getTaxes();
	}
    resetForm() {
        const {dispatch, reset} = this.props;
        dispatch(reset('AddClassForm'));
        this.setState({reset: true});
	}
	getTaxes(){

		const { initialize} = this.props;
		const params ={meta_key:"TAXRULE"};
		this.setState({isLoading:true});
		HTTP.Request("get", window.admin.getMetaData,params)
		.then((result)=>{
			this.setState({ isLoading: false });
			/**to initalize redux form */
			initialize(result.data.meta_value);
		})
		
	}
	addEditTaxes(values) {
		/**set parameters */
		const data = {
			meta_key: "TAXRULE",
			meta_value: values
		}
		HTTP.Request("post", window.admin.addEditMetaData, data)
		.then(result => {
			toast(result.message,{type:"success"});
			/*log audits for user*/
			this.props.dispatch({
				type: ADMIN_TRACK_AUDIT_LOGS,
				action: {
					comment: "Modified Tax Rules",
					type: "audit"
				}
			});
		})
		.catch(err => toast(err.message,{type:"error"}))

	}
	render() {
		const {  handleSubmit  } = this.props;
		const { isLoading} = this.state;
		
		return (
			<div >
				{isLoading && <Loader/>}
				<form onSubmit={handleSubmit(this.addEditTaxes)}>		           								                    
					<Field fieldName="Default Tax*" icon='fa fa-info-circle' tooltip={infoOf.default_tax} component={renderField} type="number" name="defaultTax" validate={required}/>
					
					<FieldArray placeholder1="Enter Pincode" placeholder2="Enter Tax"  formGroupClassName="" name="taxes" component={FieldArrayComp}/>   		                   
					<div className="form-actions">
						<button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>Submit</button>
					</div>               		                
		        </form>
			</div> 
		)
	}
}
let TaxesForm = reduxForm({
    form: 'tax_form',
})(Taxes);

export default TaxesForm;