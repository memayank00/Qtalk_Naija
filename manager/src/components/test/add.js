import React, { Component } from 'react';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";
import {HelpBlock } from 'react-bootstrap';

import { required, ValidateOnlyAlpha} from '../common/fieldValidations';

/**COMPONENT */
import RenderFiled from "../common/renderField";
import PageHeader from "../common/pageheader"; 
import Loader from "../common/loader";
import DropdownComp from "../common/DropdownList";
import FieldArrayComp from "./element/fieldArray"; 
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
/**CONSTANT DATA */
import {STATUS} from "../common/options";
import infoOf from '../common/tooltip-text';

class upsertFAQ extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading:false,
            formAction :"ADD",
            status:true,
        }

        /**event binding  */
        this.upsert = this.upsert.bind(this);
        this.one = this.one.bind(this);
        this.getFile = this.getFile.bind(this);
        this.getRoles = this.getRoles.bind(this);
    }

    componentWillMount(){
        const { match} = this.props;
        /*extract id from request*/
        let ID = (match.params._id) ? match.params._id : null;
        /**to getdetails of particualr test */
        if (ID) this.one()
        /**to get customer roles  */
        else this.getRoles({ type: 'customer', limit: 100 });
    }
    
    render() {
        const { handleSubmit } = this.props;
        const {isLoading, formAction,image,status} = this.state
        return (
            <div>
                
                {isLoading ? <Loader /> : <div><PageHeader route={formAction === "ADD" ? "Add New Test" : "Edit Test"} parent="Tests" parentRoute="/test" />

                <div className="tab-pane active" >
                        <form onSubmit={handleSubmit(this.upsert)}  >                                             
                        <Field name="title" fieldName="Test Name*" type="text" component={RenderFiled} validate={[required, ValidateOnlyAlpha]} />
                        <Field name="content" textarea fieldName="Description*" type="text" component={RenderFiled} validate={[required]} /> 
                        
                        <label>Image</label>
                        <input  type="file" onChange={this.getFile} accept="image/*" className='form-control' /><br />
                            {image ? <img src={image.secure_url} alt="" width='120px' className="img-responsive img-thumbnail i-bot" /> : null}
                        <Field name="status"
                            options={STATUS}
                            label="Status"
                            defaultValue={status ? "Active" : "In-Active"}
                            textField="title"
                            valueField="value"
                            component={DropdownComp}
                        /><br /> 
                        <Field name="defaultPrice" icon='fa fa-info-circle' tooltip={infoOf.default_tax} fieldName="Default Price*" type="number" component={RenderFiled} validate={[required]} />
                            <HelpBlock>Default Price will be applicable if we dont found any price for a role</HelpBlock>
                        <Field name="order" icon='fa fa-info-circle' tooltip={infoOf.order} fieldName="Order" type="number" component={RenderFiled}  />
        
                        <FieldArray  name="price" component={FieldArrayComp} />                                          
                        <div className="form-actions">
                            <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>{formAction === "ADD" ? "Add " : "Update"}</button>
                        </div>
                    </form>
                </div>
                </div>
                }

            </div>
        );
    }

    upsert(data) {
        const { match } = this.props; 
        if (match.params._id) data._id = match.params._id;

         /*add file to request*/
        let formData = new FormData(); 
        formData.append("file", this.state.file);
        formData.append("data", JSON.stringify(data));

        this.setState({ isLoading: true });
        HTTP.Request("post", window.admin.upsertTest, formData)
        .then(result => {
            this.setState({ isLoading: false });
            this.props.dispatch(push("/test"));
            toast(result.message, { type: "success" });   
            
            /*log audits for user*/
            this.props.dispatch({
                type: ADMIN_TRACK_AUDIT_LOGS,
                action: {
                    comment: "Modified the content of Test - " + result.data.title,
                    type: "audit"
                }
            });
        })
        .catch(err => {
            this.setState({ isLoading: false });
            this.props.dispatch(push("/test"));
            toast(err.message, { type: "error" });           
        });        
    }

  
    one() {
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let ID = (match.params._id) ? match.params._id : null;

        if (ID) {
            this.setState({ isLoading: true, formAction: "EDIT" })
            HTTP.Request("get", window.admin.getATest, { _id: ID })
            .then(result => {
                this.setState({ isLoading: false, status: result.data.status, image: result.data.image })
                /*set data to form*/
                initialize(result.data);
            })
            .catch(err => {
                this.setState({ isLoading: false })
                toast(err.message,{type:"error"});
                this.props.dispatch(push("/test"));
            });
        }
    }

    getFile(e) {
        this.setState({ file: e.target.files[0] })
    }

    /**to get list of roles */
    getRoles(params = {}) {
        /**to start Loader */
        this.setState({ isLoading: true })
        HTTP.Request("get", window.admin.getRoles, params)
        .then((response) => {
            let array = response.data.role;
            let options = array.map(e => { return { type: e.slug } });
            if(options){
                this.props.initialize({ price: options });
                this.setState({ isLoading: false })
            }          
        })
        .catch(err => {
            this.setState({ isLoading: false })
            toast(err.message, { type: "error" });
            this.props.dispatch(push("/test"));
        });
    }
}

//decorate form component
let upsertFAQ_Form = reduxForm({
    form: "FAQ_Form",
    validate: function (values) {
        const errors = {};
        /**for implementing validation on discounted price field */
        if (values.price) {
            const priceArrayErrors = []
            values.price.forEach((element, index) => {
                if (element && element.price && element.discountedPrice && (parseInt(element.discountedPrice) > parseInt(element.price))) {
                    priceArrayErrors[index] = { discountedPrice: 'Must be less Than Price' }
                } else {
                    if (priceArrayErrors[index]) priceArrayErrors[index] = undefined;
                }
            })
            errors.price = priceArrayErrors;
        }

        return errors;
    }
})(upsertFAQ);

export default upsertFAQ_Form;