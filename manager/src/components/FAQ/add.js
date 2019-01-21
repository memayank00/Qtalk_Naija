import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";
import {Tabs, Tab} from "react-bootstrap";

import { required, ValidateOnlyAlpha,faqOrder} from '../common/fieldValidations';

/**COMPONENT */
import RenderFiled from "../common/renderField";
import PageHeader from "../common/pageheader"; 
import Loader from "../common/loader";
import DropdownComp from "../common/DropdownList";
import Revisions from "./element/revisions";
/* import Editor from "../common/editor"; */
import FroalaEditorComp from "../common/floalaEditor";
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';

/**CONSTANT DATA */
import {STATUS} from "../common/options";
import infoOf from "../common/tooltip-text";

class upsertFAQ extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading:false,
            formAction :"ADD",
            status:true,
            revisions:[],
            categoryArray:[]
        }

        /**event binding  */
        this.upsertCMS = this.upsertCMS.bind(this);
        this.getaCMS = this.getaCMS.bind(this);
        this.getCategory=this.getCategory.bind(this);
    }

    componentWillMount(){
        this.getaCMS();
        this.getCategory({type:"FAQ_Category",order:"title",status: true,trash: false});
        
    }
    
    render() {
        const { handleSubmit } = this.props;
        const { isLoading, formAction, revisions,categoryArray} = this.state
        
        return (
            <div>

                {isLoading ? <Loader /> : <div><PageHeader route={formAction ==="ADD"?"Add FAQ":"Edit FAQ"} parent='FAQs' parentRoute="/faq" />
              
                <div className="tab-pane active" >
                    <Tabs defaultActiveKey={1} animation={false} id="profileTabs" >
                        <Tab eventKey={1} title={formAction ==="ADD"?"Add New FAQ":"Edit FAQ"}>
                            <form onSubmit={handleSubmit(this.upsertCMS)}  >                                             
                                <Field name="title" fieldName="Question*" type="text" component={RenderFiled} validate={[required, ValidateOnlyAlpha]} />
                                <Field name="content" textarea fieldName="Answer*" type="text" component={FroalaEditorComp} content={this.state.content} validate={[required]} />  
                                <Field name="order" icon='fa fa-info-circle' tooltip={infoOf.order} fieldName="Order" type="number" component={RenderFiled} validate={[faqOrder]}/>  
                                <Field name="category"
                                    options={categoryArray}
                                    label="Category*"
                                    textField="faq_category"
                                    valueField="faq_category"
                                    component={DropdownComp}
                                    validate={[required]}
                                />
                                <Field name="status"
                                    options={STATUS}
                                    label="Status"
                                    defaultValue={this.state.status ? "Active" : "In-Active"}
                                    textField="title"
                                    valueField="value"
                                    component={DropdownComp}
                                    
                                /><br /> 
                                
                                <div className="form-actions">
                                    <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>{formAction === "ADD" ? "Add " : "Update"}</button>
                                </div>
                            </form>
                        </Tab>
                        <Tab eventKey={2} title="Revisions">
                            <Revisions revisions={revisions} />
                        </Tab>
                    </Tabs>
                        
                </div>
                </div>
                }

            </div>
        );
    }

    upsertCMS(data) {

        if(data.category=='All' || data.category =='all'){
            toast('Enter valid category', { type: "error" })
            return;
        }

        const { match } = this.props;
        this.setState({ isLoading: true });
        /*bind type of Post*/
        data.type = "FAQ";
        if (match.params._id) data.editID = match.params._id;

        let formData = new FormData();
        /*add file to request*/
        formData.append("file", this.state.file);
        formData.append("data", JSON.stringify(data));

        this.props.dispatch({
            type: "Admin-upsertCMS",
            data: formData,
            success: (r) => {
                this.props.dispatch(push("/faq"));
                toast.success(r.message);
                this.setState({ isLoading: false });
                /*log audits for user*/
                this.props.dispatch({
                    type: ADMIN_TRACK_AUDIT_LOGS,
                    action: {
                        comment: "Modified the content of FAQ - " + r.data.title,
                        type: "audit"
                    }
                });
            },
            error: (e) => {
                if (e.errors) {
                    e.errors.map((error) => toast(error, { type: "error" }))
                }
            }
        });
    }

      /* to get ctaegory dropdownlist */
      getCategory(params ={}) {
        this.setState({ isLoading: true });
        this.props.dispatch({
            type: "Admin-getCMS",
            data: params,
            success: (response) => {
                this.setState({
                    categoryArray:(response.data.records) ? response.data.records : [],
                    isLoading: false,
                  
                })
            },
            error: (e) => {
                this.setState({
                    categoryArray: [],
                    isLoading: false,
                })
            }
        });
    }

  
    getaCMS() {
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let cmsID = (match.params._id) ? match.params._id : null;

        if (cmsID) {
            this.setState({ isLoading: true, formAction: "EDIT" })
            HTTP.Request("get", window.admin.getaCMS, { _id: cmsID })
            .then(result => {
                this.setState({ isLoading: false, status: result.data.data.status, revisions: result.data.revisions?result.data.revisions:[],content:result.data.data.content })
                /*set data to form*/
                initialize(result.data.data);
            })
        }
    }

}

//decorate form component
let upsertFAQ_Form = reduxForm({
    form: "FAQ_Form",
})(upsertFAQ);


export default upsertFAQ_Form;