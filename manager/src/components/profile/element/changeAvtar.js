import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import HTTP from '../../../services/http';
import Session from '../../../services/session';
/**COMPONENTS */
import noImage from "../../../assets/noImage.png"
import { CHANGE_ADMIN_AVTAR, ADMIN_TRACK_AUDIT_LOGS} from "../../common/actions";
import Loader from "../../common/loader";
import ShowPopup from '../../common/modal';
class ChangeAvtar extends Component {

    constructor(props){
        super(props);

        this.state={
            isLoading:false,
            show:false
 
        }
        /**event binding */
        this.closeModal = this.closeModal.bind(this);
        this.deleteAvtar = this.deleteAvtar.bind(this);
        this.getFile = this.getFile.bind(this);
        this.uploadAvtar = this.uploadAvtar.bind(this);
        this.showModal = this.showModal.bind(this);

    }
  
    render() {
        const { user:{image,_id}} = this.props;
        console.log(this.props);
        const { isLoading,file,show } = this.state;
        return (
            <div>

                {/* <!-- CHANGE AVATAR TAB --> */}
                {isLoading ? <div className="min-height500"><Loader /></div>:<div className="tab-pane" id="tab_1_2">
                    <label >Avatar Image*</label>  
                    <input className='form-control'  type="file" onChange={this.getFile} accept="image/*" /><br />                                                             
                                
                                {/* preview */}
                                <div className="fileinput-new thumbnail" style={{ width: "200px", height: "150px" }}>
                                {image && image.secure_url ?<a className="close-btn preview-image" title="Delete" onClick={this.showModal}><span  aria-hidden="true">&times;</span></a>:null}
                               <img src={image && image.secure_url ? image.secure_url : noImage} className="avtar-preview-image" alt="avatar"/>
                                 </div>
                                
                               

                        <div className="margin-top-10">
                        <button type="button" disabled={file ? false:true} onClick={ this.uploadAvtar}className="btn green uppercase" >Upload</button>         
                        </div>  
                    {show ? <ShowPopup show={true} closeParentModal={this.closeModal} func={this.deleteAvtar} message="Profile Image"/>:null}           
                </div>}
                {/* <!-- END CHANGE AVATAR TAB --> */}
                
                
            </div>
        );
    }
    /**to change the state of parent show */
    showModal() {
        this.setState({ show: true })
    }
    /**to change the state of parent show */
    closeModal(){
        this.setState({show:false})
    }
    /**to delte image  */
    deleteAvtar(){
        const { user: { image, _id } } = this.props;
        let data ={public_id :image.public_id, _id :_id};

        HTTP.Request("post", window.admin.addEditUser, data)
        .then(result => {
            Session.setSession("user", result.data);
            this.props.dispatch({
                type: CHANGE_ADMIN_AVTAR,
                data: result.data
            })
            /**to stop loader */                    
            this.setState({ isLoading: false,show:false });
            toast(result.message);
        })
        .catch(err => toast(err.message));
    }
    getFile(e) {        
        this.setState({ file: e.target.files[0] })
    }

    uploadAvtar(){
        const { user: {_id } } = this.props;
        let obj ={userID:_id},
            formData = new FormData();

            formData.append("file", this.state.file);
            formData.append("data", JSON.stringify(obj));
        this.setState({isLoading:true});
        HTTP.Request("post", window.admin.changeUserAvtar,formData)
        .then(result =>{

            Session.setSession("user", result.data);
            this.props.dispatch({
                type:CHANGE_ADMIN_AVTAR,
                data: result.data
            });

            /*log audits for user*/
            this.props.dispatch({
                type: ADMIN_TRACK_AUDIT_LOGS,
                action: {
                    comment: "Changed Profile Picture",
                    type: "audit"
                }
            });
            /**to stop loader */
            this.setState({ isLoading: false,file:undefined });
            toast(result.message, { type: "success" });
        })
        .catch(err => toast(err.message,{type:"error"}));
    }
}
//decorate form component
function mapStateToProps(state) {
    return ({
        user: state.admin && state.admin.user ? state.admin.user :null
    });
}

export default connect (mapStateToProps)(ChangeAvtar);
