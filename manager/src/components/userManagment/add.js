import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";
import Socket from "../../sockets";

import { required,emailValiadte,mobileValidate } from '../common/fieldValidations';
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
/**COMPONENT */
import RenderFiled from "../common/renderField";
import PageHeader from "../common/pageheader"; 
import Multiselect from "../common/multiselect";
import Loader from "../common/loader";
import DropdownComp from "../common/DropdownList";

class AddUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roleOptions:[],
            isLoading:false,
            formAction :"ADD",
            status:true,
            // selectedRole:{}
        }

        /**event binding  */
        this.addEditUser = this.addEditUser.bind(this);
        this.getAUser = this.getAUser.bind(this);
        this.getRolesOptions = this.getRolesOptions.bind(this);

    }

    componentWillMount(){
        this.getAUser();
        this.getRolesOptions({type:"admin"});
    }
    
    render() {
        const { handleSubmit } = this.props;
        const { roleOptions, isLoading, formAction, selectedRole,defaultRole} = this.state;
        return (
            <div>

                {isLoading ? <Loader /> : <div><PageHeader route={formAction ==="ADD"?"Add New User":"Edit User"} parent="User Management" parentRoute="/user-management"/>
              
                <div className="tab-pane active" >
                    <form onSubmit={handleSubmit(this.addEditUser)}  >                         
                        <Field name="role"
                            options={roleOptions}                            
                            selectedValues={[selectedRole ? selectedRole : defaultRole]}
                            multi={false}
                            component={Multiselect} 
                            validate={[required]}
                            statusBased  
                            fieldName="Role Name*"                      
                        />
                        <Field name="firstname" fieldName="First Name*" type="text" component={RenderFiled} validate={[required]} />
                        <Field name="lastname" fieldName="Last Name*" type="text" component={RenderFiled} validate={[required]} />
                        <Field name="username" fieldName="User Name*" type="text" component={RenderFiled} validate={[required]} />
                        <Field name="email" fieldName='Email*' type="text" placeholder="abc@yourdoamil.com" component={RenderFiled} validate={[emailValiadte, required]} />
                        <Field name="mobile" fieldName='Mobile*' type="number"  component={RenderFiled} validate={[mobileValidate, required]} />
                        <Field name="status"
                            options={[{ label: "Active", value: true }, { label: "In-Active", value: false }]}
                            label="Status"
                            defaultValue={ this.state.status  ? "Active" : "In-Active"}
                            textField="label"
                            valueField="value"
                            component={DropdownComp}
                        /><br />                      
                        <div className="form-actions">
                            <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>{formAction === "ADD" ? "Add " : "Edit"}</button>
                        </div>
                    </form>
                </div>
                </div>
                }

            </div>
        );
    }

    addEditUser(data) {
        HTTP.Request("post", window.admin.addEditUser, data)
        .then(result => { 
            this.props.dispatch(push("/user-management"));
            toast(result.message,{type:"success"});

            /**to check if the role of the user is changed */
            if(result.data.role._id !== this.state.selectedRole._id ){
                /**call socket to logout the user whose role has been changed */
                Socket.callEvent("logout",{userId : result.data._id})            
            }

            /*log audits for user*/
            this.props.dispatch({
                type: ADMIN_TRACK_AUDIT_LOGS,
                action: {
                    comment: "Modified details of Admin User - " + (result.data.firstname + ' ' + result.data.lastname + ' (' + result.data.email+')' ),
                    type: "audit"
                }
            });
        })
        .catch(err => {
            if(err && err.error && err.error.length>0)
            err.error.map(message => toast(message,{type:"error"})  ) 
            else toast(err.message, { type: "error" }) ;
        })
    }

    getAUser(){
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let userID = (match.params.id) ? match.params.id : null;

        if(userID){
            this.setState({ isLoading: true, formAction:"EDIT"})
            HTTP.Request("get", window.admin.getAUser, { id: userID})
            .then(result => {
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                        selectedRole: result.data.role ? result.data.role : {},
                        status: result.data.status 
                    })
                }, 1000);
             

                /*set data to form*/
                initialize(result.data);
            })
        }
    
    }

    getRolesOptions(params={}){
        /**start loader and stop it only in edit case */
        const { match } = this.props;
        let userID = (match.params.id) ? match.params.id : null;
        this.setState({isLoading:true})
        HTTP.Request("get", window.admin.getRolesOptions, params)
        .then( result =>{
            let defaultRole= result.data.filter(e => e.title === "Admin")[0];
            let _state = { roleOptions: result.data, defaultRole: defaultRole };
            if (!userID) _state.isLoading = false;
            this.setState(_state)
        })
        .catch(err => console.log("err",err))
    }
}

//decorate form component
let AddUser_Form = reduxForm({
    form: "addUser_Form"
})(AddUser);

export default AddUser_Form;