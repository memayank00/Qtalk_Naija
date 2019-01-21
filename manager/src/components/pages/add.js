import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";
import _ from 'lodash/core';
import { Tab, Tabs,Alert } from "react-bootstrap";

// import { required, ValidateOnlyAlpha } from '../common/fieldValidations';

import { required, ValidateOnlyAlpha,slugValidation } from '../common/fieldValidations';

/**COMPONENT */
import RenderField from "../common/renderField";
/* import ImageCropper from "../common/ImageCropper"; */

import PageHeader from "../common/pageheader"; 
import DropdownComp from "../common/DropdownList";
import ImageCropper from "../common/ImageCropper";
import Editor from "../common/editor";
import FroalaEditorComp from "../common/floalaEditor";
import Loader from "../common/loader";
import Revisions from "./element/revisions";
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
import infoOf from '../common/tooltip-text';
import { slugify } from "../../libs/Helper";
import { HelpBlock } from 'react-bootstrap';

/**CONSTANT DATA */
import {POSITIONS} from "../common/options"

class AddPage extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            revisions : [],
            content : "",
            isLoading:false,
            formAction :"ADD",
            status:true,
            _Position:[POSITIONS[0]]
        }
        
        /**event binding  */
        this.upsertCMS = this.upsertCMS.bind(this);
        this.getaCMS = this.getaCMS.bind(this);
        this.getFile = this.getFile.bind(this);
        this.onChange = this.onChange.bind(this);

    }

    componentWillMount(){
        this.getaCMS();
    }

    onChange(event) {
        const { change } = this.props;
        if (event.target.value) {
            change("slug", slugify(event.target.value));
        }
    }
    
    render() {
        const { handleSubmit } = this.props;
        const { isLoading, formAction,imageSize } = this.state;
        
        return (
            <div className='relative'>
                {isLoading ? <Loader /> : <div><PageHeader route={formAction ==="ADD"?"Add New Page":"Edit Page"} parent='Pages' parentRoute='/pages' />
              
                <div className="tab-pane active" >
                    {/* <Tabs defaultActiveKey={1} animation={false} id="profileTabs" >
                        <Tab eventKey={1} title={formAction ==="ADD"?"Add New Page":"Edit Page"}> */}
                            <form onSubmit={handleSubmit(this.upsertCMS)}  >
                                <Field name="name" fieldName="Page Name*" type="text"  component={RenderField} validate={[required]} />
                                <Field name="title" fieldName="Page Title*" type="text"  component={RenderField} validate={[required]} />
                                <Field textarea name="pageMetaInfo" fieldName="Page Meta Info*" type="text"  component={RenderField} validate={[required]} />
                                <Field textarea name="pageKeyword" fieldName="Page Keyword*" type="text"  component={RenderField} validate={[required]} />
                                <Field name="slug" fieldName="Page URL*" type="text"  component={RenderField} validate={[required]} />
                                <Field name="cmsContent" fieldName="Page View*" type="text"  component={FroalaEditorComp} validate={[required]} />
                                
                                {/* <Field name="title" fieldName="Title*" type="text" onChange={this.onChange} component={RenderField} validate={[required, ValidateOnlyAlpha]} />
                                <Field
                                                name="slug"
                                                fieldName="Custom URL*"
                                                type="text"
                                                component={RenderField}
                                                validate={[
                                                    required
                                                ]}
                                            />
                              
                                <div className="row">
                                    <div className="col-sm-12">            
                                        <Alert bsStyle="info">
                                        <strong>NOTE : </strong>
                                        <span>Note: If no featured image is uploaded, default image will be selected</span>          
                                        </Alert>
                                    </div>
                                    <div className="col-sm-6">  
                                   
                                        <Field name="showImage"
                                            options={[{ label: "DefaultImage", value: 'DefaultImage' }, { label: "UploadedImage", value: 'UploadImage' },{ label: "NoImage", value: 'NoImage' }]}
                                            label="Select Image"
                                            defaultValue={'DefaultImage'}
                                            textField="label"
                                            valueField="value"
                                            component={DropdownComp}/>
                                    </div>
                                   <div className="col-sm-6"> 
                                        <label> Featured Image   </label>
                                        <Field
                                        component={ImageCropper}
                                        name="image"
                                        id={"imagePage"}
                                        minWidth={1300}
                                        minHeight={550}
                                        dimensionsCheck={true}
                                        ratioUpper={1300} ratioLower={550} 
                                        validate={formAction === "ADD" ? [required]:[]}/>
                                        <br />                                                             
                                        {imageSize &&  <HelpBlock style={{ color: '#e73d4a' }}>
                                                    {"Please select image with minimum resolution of 1300 x 450 pixels"}
                                            </HelpBlock>}
                                        {this.state.image ? <img src={this.state.image.secure_url} alt="" width='120px' className="img-responsive img-thumbnail i-bot"/> : null}
                                    </div>           
                                </div>                
                               
                                <Field textarea name="summary" component={RenderField} fieldName="Summary" />                               
                                <Field name="meta_title" icon='fa fa-info-circle' tooltip={infoOf.meta_title} fieldName="Meta Title*" type="text" component={RenderField} validate={[required]} />
                                <Field name="meta_description" textarea fieldName="Meta Description" component={RenderField}/>                
                                <div className="row">
                                    <div className="col-sm-6">
                                        <Field name="order" icon='fa fa-info-circle' tooltip={infoOf.order} fieldName="Order" type="number" component={RenderField} />
                                    </div>
                                    <div className="col-sm-6">
                                        <Field name="status"
                                            options={[{ label: "Active", value: true }, { label: "In-Active", value: false }]}
                                            label="Status"
                                            defaultValue={this.state.status ? "Active" : "In-Active"}
                                            textField="label"
                                            valueField="value"
                                            component={DropdownComp}/>
                                    </div>
                                </div>   */}
          
                                <div className="form-actions">
                                        <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>{formAction === "ADD" ? "Add" : "Update"}</button>
                                </div>
                            </form>
                        {/* </Tab> */}
                        {/* <Tab eventKey={2} title="Revisions">
                            <Revisions revisions={this.state.revisions} />
                        </Tab> */}
                    {/* </Tabs> */}
                    
                </div>
                </div>
                }

            </div>
        );
    }

    onChange(event) {
        const { change } = this.props;
        if (event.target.value) {
            change("slug", slugify(event.target.value));
        }
    }

    upsertCMS(data) {
        
        const { match } = this.props;
        this.setState({isLoading: true});

        /*bind type of Post*/
        data.type = "page";
        if(match.params._id) data.editID = match.params._id;

        let formData = new FormData();
        /*add file to request*/
        formData.append("file", data.image);
        /* formData.append("file", data.image); */
        formData.append("data", JSON.stringify(data));

        this.props.dispatch({
            type : "Admin-upsertCMS",
            data : formData,
            success : (r) => {
                this.props.dispatch(push("/pages"));
                toast.success(r.message);
                this.setState({isLoading: false});
                /*log audits for user*/
                this.props.dispatch({
                    type: ADMIN_TRACK_AUDIT_LOGS,
                    action: {
                        comment: "Modified the content of Page - " + r.data.title,
                        type: "audit"
                    }
                });
            },
            error : (e) => {
                if(e.errors){
                    this.setState({isLoading: false});
                    e.errors.map((error) => toast(error, {type: "error"}))
                }
            }
        });
    }

    getFile(event) {
        var reader = new FileReader(); 
        var selected=event.target.files[0]// CREATE AN NEW INSTANCE.
        const scope = this;
        reader.onload = function (e) {
            var img = new Image();      
            img.src = e.target.result;
            img.onload = function () {
              var height= img.height;
              var width = img.width;
              if(height <450 && width<1300){
                scope.setState({ imageSize:true });
                document.getElementById("uploadCaptureInputFile").value = "";
              }else{
                scope.setState({ file:selected,imageSize:false  })
                }
            }
        };
        reader.readAsDataURL(event.target.files[0]);
       /*  this.setState({ file: e.target.files[0],imageSize:false }); */
    }


    getaCMS() {
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let cmsID = (match.params._id) ? match.params._id : null;

        if(cmsID){
            this.setState({ isLoading: true,  formAction:"EDIT"})
            HTTP.Request("get", window.admin.getaCMS, { _id: cmsID})
            .then(result => {
                this.setState({ isLoading: false, status: result.data.data.status, _Position: [_.find(POSITIONS, {value:result.data.data.position})], content:result.data.data.content?result.data.data.content:"", image:result.data.data.image?result.data.data.image:"", revisions: result.data.revisions?result.data.revisions:[]})
                /*set data to form*/
                initialize(result.data.data);
            })
        }
    }
}

//decorate form component
let AddPage_Form = reduxForm({
    form: "AddPage_Form "
})(AddPage);


export default AddPage_Form;