import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";
import {Tabs, Tab} from "react-bootstrap";

import { required, ValidateOnlyAlpha } from '../common/fieldValidations';

/**COMPONENT */
import RenderFiled from "../common/renderField";
import PageHeader from "../common/pageheader"; 
import Editor from "../common/editor";
import Loader from "../common/loader";
import Revisions from "./element/revisions";
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
class AddEmail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            revisions:[],
            content:'',
            isLoading:false,
            formAction :"ADD"
        }
        /**event binding  */
        this.addEditEmail = this.addEditEmail.bind(this);
        this.getaCMS = this.getaCMS.bind(this);

    }

    componentWillMount(){
        this.getaCMS()
    }
    
    render() {
        const { handleSubmit, invalid, submitting} = this.props;
        const { isLoading, formAction, content } = this.state
        return (
            <div>

                {isLoading ? <Loader /> : <div><PageHeader route={formAction ==="ADD"?"Add New Template":"Edit Template"} parent="Email Templates" parentRoute='/email-management' />
              
                <div className="tab-pane active" >
                    <Tabs defaultActiveKey={1} animation={false} id="profileTabs" >
                        <Tab eventKey={1} title={formAction ==="ADD"?"Add New Template":"Edit Template"}>
                            <form onSubmit={handleSubmit(this.addEditEmail)}  >                        
                                <Field name="title" fieldName="Email Name*" type="text" readOnly={formAction === "ADD" ? false : true} component={RenderFiled} validate={[required, ValidateOnlyAlpha]} />                       
                                 <label>Content</label>
                                 <Field name="content"  type="text" component={Editor} validate={[required]} content={content} /><br/>          
                                <div className="form-actions">
                                        <button type="submit" className="btn green uppercase" disabled={invalid || submitting}>{formAction === "ADD" ? "Save" : "Update"}</button>
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

    addEditEmail(data) {
        const { match } = this.props;
        /*bind type of Post*/
        data.type = "email";
        if (match.params.id) data.editID = match.params.id;

        let formData = new FormData();   
        formData.append("data", JSON.stringify(data));

        HTTP.Request("post", window.admin.upsertCMS, formData)
        .then(result => {
            this.props.dispatch(push("/email-management"));
            toast(result.message,{type:"success"});

            /*log audits for user*/
            this.props.dispatch({
                type: ADMIN_TRACK_AUDIT_LOGS,
                action: {
                    comment: "Modified the content of Email Template - "+result.data.title,
                    type: "audit"
                }
            });
        })
        .catch(err => {
            if (err && err.errors.length > 0) err.errors.map(message => toast(message, { type: "error" }))
            else toast(err.message, { type: 'error' })
        });
    }

    getaCMS(){
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let cmsID = (match.params.id) ? match.params.id : null;

        if(cmsID){
            this.setState({ isLoading: true, formAction:"EDIT"})
            HTTP.Request("get", window.admin.getaCMS, { _id: cmsID})
            .then(result => {
                this.setState({ isLoading: false, content: result.data.data.content, revisions: result.data.revisions?result.data.revisions:[] })

                /*set data to form*/
                initialize(result.data.data);
            })
        }
    }
}

//decorate form component
let emailManag = reduxForm({
    form: "emailMang_Form "
})(AddEmail);


export default emailManag;

