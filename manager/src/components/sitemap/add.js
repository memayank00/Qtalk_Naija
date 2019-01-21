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
import DropdownComp  from "../common/DropdownList";
import Editor from "../common/editor";
import Loader from "../common/loader";
/* import Revisions from "./element/revisions"; */
import { ADMIN_TRACK_AUDIT_LOGS } from '../common/actions';
import infoOf from '../common/tooltip-text';
import FroalaEditorComp from "../common/floalaEditor";

class AddSitemap extends Component{

    constructor(props){
        super(props)

        this.state={
            isLoading:false,
            formAction :"ADD",
            status:false,
  
        }
        this.upsertCMS=this.upsertCMS.bind(this);
        this.getaCMS = this.getaCMS.bind(this);

    }

    componentWillMount(){
        this.getaCMS();
    }

    render(){
        const { handleSubmit } = this.props;
        const { isLoading, formAction } = this.state;
        return(
            <div className='relative'>
                {isLoading ? <Loader /> : <div><PageHeader route={formAction ==="ADD"?"Add New Sitemap":"Edit Sitemap"} parent='Sitemap' parentRoute='/site-map' />
                <div className="tab-pane active" >
                   {/*  <Tabs defaultActiveKey={1} animation={false} id="profileTabs" > */}
                        <Tab eventKey={1} title={formAction ==="ADD"?"Add New Slide":"Edit Slide"}>
                            <form onSubmit={handleSubmit(this.upsertCMS)}  >
                                <Field name="link" fieldName="URL*" type="url" component={RenderFiled} validate={[required]} />
                            
                                
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
                        
                  {/*   </Tabs> */}
                    
                </div>
                </div>
            }
            </div>
        )
    }

    upsertCMS(data){
      
        const { match } = this.props;
        this.setState({isLoading: true});

        if(match.params.id) data.editID = match.params.id;
        
        HTTP.Request("post", window.admin.sitemapUpsert, data)
        .then(result => {
            this.props.dispatch(push("/site-map"));
            toast(result.message, { type: "success" });
            this.setState({ isLoading: false });
        })
        .catch(error => {
            toast(error.message, { type: "error" });
            this.setState({ isLoading: false });
        });
    }

    getaCMS(){
     
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let cmsID = (match.params.id) ? match.params.id : null;
      

        if(cmsID){
            this.setState({ isLoading: true,  formAction:"EDIT"})
            HTTP.Request("get", window.admin.onesitemap, { id: cmsID})
            .then(result => {
                
                this.setState({ isLoading: false, status: result.data.status, content:result.data.content?result.data.content:""})
                /*set data to form*/
                initialize(result.data);
            })
            .catch(error=>{
                this.setState({ isLoading: false});
            })
        }
    }


}
let addSitemap_Form=reduxForm({
    form:"addSitemap_Form"
})(AddSitemap);

export default addSitemap_Form;
