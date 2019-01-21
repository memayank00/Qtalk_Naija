import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";
import {Panel,Table,Well,Alert} from "react-bootstrap";




/**COMPONENT */
import PageHeader from "../common/pageheader"; 
import Loader from "../common/loader";
import Editor from "../common/editor";
import RenderFiled from "../common/renderField";
import { required } from '../common/fieldValidations';
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
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
        this.reply = this.reply.bind(this);
        this.one = this.one.bind(this);
    }

    componentWillMount(){
        this.one();
    }
    
    render() {
        const { handleSubmit } = this.props;
        const {  isLoading,user} = this.state;
        return (
            <div>

                {isLoading ? <Loader /> : <div><PageHeader pageTitle="" route="Feedback" />
              
                <div className="tab-pane active" >
                 {/* user details  start */}
                        <div>
                            <Panel bsStyle="info">
                                <Panel.Heading>Details</Panel.Heading>
                                <Panel.Body>
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            <tr>
                                                <td width="20%"><strong>Name</strong></td>
                                                <td>{user.name}</td>
                                            </tr>
                                            <tr>
                                                <td width="20%"><strong>Email</strong></td>
                                                <td>{user.email}</td>
                                            </tr>
                                            <tr>
                                                <td width="20%"><strong>Mobile No.</strong></td>
                                                <td>{user.mobile}</td>
                                            </tr>
                                            <tr>
                                                <td width="20%"><strong>Message</strong></td>
                                                <td>{user.message}</td>
                                            </tr>                                           
                                        </tbody>
                                    </Table>
                                </Panel.Body>
                            </Panel>
                        </div>
                        {/* user details  end */}
                        
                        <form onSubmit={handleSubmit(this.reply)}  >  
                            <Field name="subject" icon='fa fa-info-circle' tooltip={infoOf.subject} fieldName="Email Subject*" type="text" component={RenderFiled} validate={[required]} />                                                 
                        <Field name="reply" fieldName="Reply" type="text" component={Editor} 
                                content={`<p>Hi <strong>${user.name}</strong>&nbsp;</p>
                                        <p><strong>Original Message</strong> - ${user.message}</p>
                                        <p><strong>Your Reply - </strong></p>
                                        <p>Thanks&nbsp;&nbsp;</p>
                                        <p><strong>Athelte Team</strong></p>`} 
                                validate={[required,]}
                        />  
                        <div className="form-actions">
                            <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>Reply</button>
                        </div>
                    </form><br/>
                        <div>
                            <Panel bsStyle="info">
                                <Panel.Heading>Your Replies</Panel.Heading>
                                <Panel.Body>
                                    {(!user.replies || user.replies.length === 0) && <Alert bsStyle="warning">
                                        <strong>Not Replied Yet!</strong>
                                    </Alert>}
                                    {user.replies && user.replies.map((e,index) =><Well dangerouslySetInnerHTML={{__html:e}} key ={index}></Well>)}
                                </Panel.Body>
                            </Panel>
                        </div>                  
                </div>
                </div>
                }

            </div>
        );
    }

    reply(data) {
        const {user:{email,_id}}= this.state
        data.user={ email :email,_id:_id} ;
        this.setState({isLoading:true})
        HTTP.Request("post", window.admin.replyFeedback,data)
        .then( result => {
            this.setState({ isLoading: false });
            this.props.dispatch(push("/feedback"))
            toast(result.message,{type:"success"});

            /*log audits for user*/
            this.props.dispatch({
                type: ADMIN_TRACK_AUDIT_LOGS,
                action: {
                    comment: "Replied to Feedback - Subject: " +data.subject,
                    type: "audit"
                }
            });

        })
        .catch(err => {
            this.setState({ isLoading: false });
            this.props.dispatch(push("/feedback"))
            toast(err.message, { type: "error" })
        })     
    }

    one() {
        const { match } = this.props;
        /*extract plant id from request*/
        let cmsID = (match.params._id) ? match.params._id : null;

        if (cmsID) {
            this.setState({ isLoading: true, formAction: "EDIT" })
            HTTP.Request("get", window.admin.getAFeedback, { _id: cmsID })
            .then(result => {
                this.setState({ isLoading: false, user: result.data })
            })
        }
    }

}

//decorate form component
let upsertFAQ_Form = reduxForm({
    form: "FAQ_Form",
})(upsertFAQ);

export default upsertFAQ_Form;