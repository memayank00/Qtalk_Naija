import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";
import {Tabs, Tab} from "react-bootstrap";

import { required, ValidateOnlyAlpha } from '../common/fieldValidations';

/**COMPONENT */
import RenderField from "../common/renderField";
import PageHeader from "../common/pageheader"; 
import DropdownComp from "../common/DropdownList";
import Editor from "../common/editor";
import Loader from "../common/loader";
import Revisions from "./element/revisions";
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
import infoOf from '../common/tooltip-text';
import FroalaEditorComp from "../common/floalaEditor";

class AddBlock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            revisions : [],
            content : "",
            isLoading:false,
            formAction :"ADD",
            status:true
        }
        /**event binding  */
        this.upsertCMS = this.upsertCMS.bind(this);
        this.getaCMS = this.getaCMS.bind(this);
        this.getFile = this.getFile.bind(this);
    }

    componentWillMount(){
        this.getaCMS();  
    }
    
    render() {
        const { handleSubmit } = this.props;
        const {  isLoading, formAction } = this.state
        return (
            <div className='relative'>
            
                {isLoading ? <Loader /> : <div><PageHeader route={formAction ==="ADD"?"Add New CMS Block":"Edit CMS Block"} parent='CMS Blocks' parentRoute='/cms-blocks' />
              
                <div className="tab-pane active" >
                    <Tabs defaultActiveKey={1} animation={false} id="profileTabs" >
                        <Tab eventKey={1} title={formAction ==="ADD"?"Add New CMS Block":"Edit CMS Block"}>
                            <form onSubmit={handleSubmit(this.upsertCMS)}  >
                            <Field name="custom_link" icon='fa fa-info-circle' tooltip={infoOf.custom_link} fieldName="Page type" type="text" component={RenderField} />
                                <Field name="title" fieldName="Title*" type="text" component={RenderField} validate={[required, ValidateOnlyAlpha]} />

                              {/*   <label>Featured Image</label>
                                <input  type="file" onChange={this.getFile} accept="image/*" className='form-control' /><br />                                                             
                                
                                    {this.state.image ? <img src={this.state.image.secure_url} alt="" width='120px' className="img-responsive img-thumbnail i-bot"/> : null} */}

                        
                                <Field name="summary" textarea fieldName="Summary" component={RenderField}  />
                                <Field name="content" fieldName="Content" type="text" component={FroalaEditorComp} content={this.state.content} />

                               
                              {/*   <Field name="extra_classes" icon='fa fa-info-circle' tooltip={infoOf.classes} fieldName="Classes" type="text" placeholder='Extra Classes (Space Seperated)' component={RenderField} /> */}
                               {/*  <Field name="order" icon='fa fa-info-circle' tooltip={infoOf.order} fieldName="Order" type="number" component={RenderField} /> */}
                                                    
                                <Field name="status"
                                    options={[{ label: "Active", value: true }, { label: "In-Active", value: false }]}
                                    label="Status"
                                    defaultValue={this.state.status ? "Active" : "In-Active"}
                                    textField="label"
                                    valueField="value"
                                    component={DropdownComp}
                                /><br />
          
                                <div className="form-actions">
                                        <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>{formAction === "ADD" ? "Add" : "Update"}</button>
                                </div>
                            </form>
                        </Tab>
                        <Tab eventKey={2} title="Revisions">
                            <Revisions revisions={this.state.revisions} />
                        </Tab>
                    </Tabs>
                    
                </div>
                </div>
                }

            </div>
        );
    }

    upsertCMS(data) {
        const { match } = this.props;
        this.setState({isLoading: true});
        /*bind type of Post*/
        data.type = "cms-blocks";
        if(match.params._id) data.editID = match.params._id;

        let formData = new FormData();
        /*add file to request*/
        formData.append("file", this.state.file);
        formData.append("data", JSON.stringify(data));

        this.props.dispatch({
            type : "Admin-upsertCMS",
            data : formData,
            success : (r) => {
                this.props.dispatch(push("/cms-blocks"));
                toast.success(r.message);
                this.setState({isLoading: false});
                /*log audits for user*/
                this.props.dispatch({
                    type: ADMIN_TRACK_AUDIT_LOGS,
                    action: {
                        comment: "Modified the content of CMS Block - " + r.data.title,
                        type: "audit"
                    }
                });
            },
            error : (e) => {
                if(e.errors){
                    e.errors.map((error) => toast(error, {type: "error"}))
                }
            }
        });
    }

    getFile(e) {
        this.setState({ file: e.target.files[0] })
    }

    getaCMS(){
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let cmsID = (match.params._id) ? match.params._id : null;

        if(cmsID){
            this.setState({ isLoading: true, formAction:"EDIT"})
            HTTP.Request("get", window.admin.getaCMS, { _id: cmsID})
            .then(result => {
                this.setState({ isLoading: false, status: result.data.data.status, content:result.data.data.content?result.data.data.content:"", image:result.data.data.image?result.data.data.image:"", revisions: result.data.revisions?result.data.revisions:[]})
                /*set data to form*/
                initialize(result.data.data);
            })
        }
    }
}

//decorate form component
let AddBlock_Form = reduxForm({
    form: "AddBlock_Form"
})(AddBlock);


export default AddBlock_Form;