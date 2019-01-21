import React, { Component } from 'react';
import Moment from "react-moment";
import { Link } from 'react-router-dom';
import Modal from '../../common/modal';
import TT from "../../common/tooltip";
class ROW extends Component {
    
    constructor(props){
        super(props);

        this.state={
            show: false
        }
        /*bind this with methods*/
        this.showModal = this.showModal.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    
    render() {
        const {cms} = this.props;
        return (
            <tr className="odd gradeX" >
                <td> {cms.title} </td>
                <td className="center text-center"> {cms.image ? <img className='img-thumbnail' src={cms.image.secure_url} width="120" alt="slide" /> : <label className="label label-danger" >No Image </label>} </td>
                {/* <td> {cms.meta_title} </td>                */}
                <td className="center"> {cms._Admin.firstname} </td>           
                <td><Moment format="DD MMM YYYY">{cms.created_at}</Moment></td>
                <td className="center"> <label className={cms.status?'label label-info':'label label-danger'}>{cms.status?"Active":"Pending"}</label> </td>
                <td>
                    <TT tooltip="Remove"><a className=" btn btn-xs red-mint" onClick={this.showModal}><i className="fa fa-trash no-pointer"  ></i></a></TT>
                    <TT tooltip="Edit"><Link to={'/pages/edit/' + cms._id} className=" btn btn-xs grey-mint"><i className="fa fa-pencil-square-o"  ></i></Link></TT>
                    {this.state.show && <Modal show={true} func={this.deleteRow} closeParentModal={this.closeModal} title={cms.title} />}                    
                </td>
            </tr>
        );
    }

    showModal() {
        /*show popup and confirm before delete*/
        this.setState({ show: true });
    }

    deleteRow(){
        this.setState({ isLoading: true,show:false });
        /*delete row by call prop func*/
        this.props.delete(this.props.cms._id);        
    }

    closeModal() {
        this.setState({ show: false });
    }

}

export default ROW;