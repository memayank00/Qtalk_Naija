import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import {  toast } from 'react-toastify';
import HTTP from "../../services/http";

import { required, ValidateOnlyAlpha } from '../common/fieldValidations';

/**COMPONENT */
import RenderFiled from "../common/renderField";
import PageHeader from "../common/pageheader"; 
import Multiselect from "../common/multiselect";
import Loader from "../common/loader";
import DropdownComp from "../common/DropdownList";


/**CONSTANT DATA */
import {Customer_Role_OPTIONS as OPTIONS} from "../common/options";
import infoOf from "../common/tooltip-text";

class AddRole extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedpermissions:[],
            isLoading:false,
            formAction :"ADD",
            status: true,
        }
        /**event binding  */
        this.addEditRole = this.addEditRole.bind(this);
        this.getARole = this.getARole.bind(this);

    }

    componentWillMount(){
        this.getARole()
    }
    
    render() {
        const { handleSubmit } = this.props;
        const { selectedpermissions, isLoading, formAction } = this.state;
        return (
            <div>
                {isLoading ? <Loader /> : <div><PageHeader route={formAction === "ADD" ? "Add New Role" : "Edit Role"} parent="Customer Role Management" parentRoute="/customer-role-management" />
              
                <div className="tab-pane active" >
                    <form onSubmit={handleSubmit(this.addEditRole)}  >
                            <Field name="title" fieldName="Role Name*" type="text" component={RenderFiled} validate={[required, ValidateOnlyAlpha]} />             
                       
                            <Field name='permissions' 
                            selectedValues={selectedpermissions}
                            options={OPTIONS} 
                            component={Multiselect} 
                            multi={true}
                            validate={[required]}
                            icon = "fa fa-info-circle"
                            tooltip = {infoOf.permissions}
                            fieldName="Permissions*"/>

                            <Field name="status"
                                options={[{ label: "Active", value: true }, { label: "In-Active", value: false }]}
                                label="Status"
                                defaultValue={this.state.status ? "Active" : "In-Active"}
                                textField="label"
                                valueField="value"
                                component={DropdownComp}
                            /><br /> 
  
                        <div className="form-actions">
                            <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>Update</button>
                        </div>
                    </form>
                </div>
                </div>
                }

            </div>
        );
    }

    addEditRole(data) {
        data.type="customer";
        HTTP.Request("post", window.admin.addEditRole, data)
        .then(result => { 
            this.props.dispatch(push("/customer-role-management"));
            toast(result.message,{type:"success"});
        })
            .catch(err => {
                if (err && err.errors.length > 0) err.errors.map(message => toast(message, { type: "error" }) )
                else toast(err.message,{type:'error'})
            });
    }

    getARole(){
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let roleID = (match.params.id) ? match.params.id : null;

        if(roleID){
            this.setState({ isLoading: true, formAction:"EDIT"})
            HTTP.Request("get", window.admin.getARole, { id: roleID})
            .then(result => {
                this.setState({ isLoading: false, selectedpermissions: result.data.permissions,status : result.data.status})

                /*set data to form*/
                initialize(result.data);
            })
        }
    }
}

//decorate form component
let customerRoleManag = reduxForm({
    form: "customerRoleManag_Form "
})(AddRole);


export default customerRoleManag;

