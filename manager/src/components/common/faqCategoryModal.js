import React, { Component } from 'react';
import { Modal, Button,Alert } from 'react-bootstrap';
import RenderFiled from "../common/renderField";
import { Field, reduxForm } from 'redux-form';
import HTTP from "../../services/http";
import DropdownComp from "../common/DropdownList";
import { required, ValidateOnlyAlpha } from '../common/fieldValidations';
/**
 * send props 'show={true }' to show the component
 * 'func' the delete function in the parent component
 * closeParentModal() to cahnge this.sate.show=false in parent function
 *  <ShowPopup show={true} func={this.deleteProfileImage}
 */

class ShowFAQPopUp extends Component {
   constructor(props){
       super(props);
       this.state={
           show:false
       }

       this.closeModel = this.closeModel.bind(this);
       this.deletefunc = this.deletefunc.bind(this);
       this.upsertCMS = this.upsertCMS.bind(this);
   }
    componentWillMount(){
      this.setState({ show: this.props.show });
    }

    /*componentWillReceiveProps(newProps){
      console.log("componentWillReceiveProps",newProps)
      if (newProps && newProps.show)
      this.setState({ show: newProps.show });
    }*/

    deletefunc(ID){
        console.log("isndie ",ID)
        /**to close model */
       /*  this.setState({ show: false }); */
        /**function is called which is to be execute on ok */
       /*  this.props.func();  */
    }
    
    closeModel(){
        /**to close modal */
        this.setState({show:false});
        this.props.closeParentModal();
    }

    render() {
        const {message,questionsCount,elementID,records,handleSubmit,invalid} =this.props;
        return (
            <div>
                <Modal 
                show={this.state.show}
                onHide={this.closeModel}
                >
                    <Modal.Header closeButton className='theme-bg'>
                        <Modal.Title>
                            Delete 
                        </Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleSubmit(this.upsertCMS)}  >   
                    <Modal.Body>
                    <Alert bsStyle="info">
                        <strong>NOTE : </strong>
                        Please Select New Category as  <strong>{questionsCount}</strong> question exist in  this category
                    </Alert><br/>
                                <Field name="category"
                                    options={records}
                                    label="Category"
                                    textField="title"
                                    valueField="faq_category"
                                    component={DropdownComp}
                                  validate={[required]} 
                                />
                                <br/>
                                
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className='btn btn-default' onClick={this.closeModel}>Cancel</Button>
                        <button type="submit" className="btn green uppercase" disabled={this.props.invalid || this.props.submitting}>{"Update"}</button>
                   {/*      <Button className='btn red-mint' onClick={()=>this.deletefunc(elementID)} >Delete</Button> */}
                        
                    </Modal.Footer>
                    </form>
                </Modal>
            </div>
            
        );
    }

    upsertCMS(data){
        let { elementID }=this.props;
        data.ID=elementID;
            HTTP.Request("post", window.admin.faqQuestionDeleteUpdate, data)
            .then(result => {
                if(result.status){
                    this.setState({ show: false });
                    this.props.getList({
                        type: "FAQ_Category",
                        order: "title",
                        page: 1,
                    })
                }
            })
       
     /*    console.log(this.props) */
    }
}


//decorate form component
let FAQ_category_questions = reduxForm({
    form: "FAQ_category_questions",
})(ShowFAQPopUp);

export default FAQ_category_questions;