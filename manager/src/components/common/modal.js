import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';


/**
 * send props 'show={true }' to show the component
 * 'func' the delete function in the parent component
 * closeParentModal() to cahnge this.sate.show=false in parent function
 *  <ShowPopup show={true} func={this.deleteProfileImage}
 */

class ShowPopup extends Component {
   constructor(props){
       super(props);
       this.state={
           show:false
       }

       this.closeModel = this.closeModel.bind(this);
       this.deletefunc = this.deletefunc.bind(this);
   }
    componentWillMount(){
      this.setState({ show: this.props.show });
    }

    /*componentWillReceiveProps(newProps){
      console.log("componentWillReceiveProps",newProps)
      if (newProps && newProps.show)
      this.setState({ show: newProps.show });
    }*/

    deletefunc(){
        /**to close model */
        this.setState({ show: false });
        /**function is called which is to be execute on ok */
        this.props.func(); 
    }
    
    closeModel(){
        /**to close modal */
        this.setState({show:false});
        this.props.closeParentModal();
    }

    render() {
        const {message} =this.props;
        return (
            <React.Fragment>
                <Modal 
                show={this.state.show}
                onHide={this.closeModel}
                >
                    <Modal.Header closeButton className='theme-bg'>
                        <Modal.Title>
                            Delete 
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you sure you want to delete <b>{message}</b>?</p>
                        <p ><strong><small>This action cannot be undone.</small></strong></p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className='btn btn-default' onClick={this.closeModel}>Cancel</Button>
                        <Button className='btn red-mint' onClick={this.deletefunc} >Delete</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
            
        );
    }
}
export default ShowPopup;