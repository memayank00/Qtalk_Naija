import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';


/**
 * send props 'showInfo={true }' to showInfo the component
 * 'func' the delete function in the parent component
 * closeParentModal() to cahnge this.sate.showInfo=false in parent function
 *  <showInfoPopup showInfo={true} func={this.deleteProfileImage}
 */

class InfoModal extends Component {
   constructor(props){
       super(props);
       this.state={
           showInfo:false
       }

       this.closeModel = this.closeModel.bind(this);
   }
    componentWillMount(){
      this.setState({ showInfo: this.props.show });
    }

    closeModel(){
        /**to close modal */
        this.setState({showInfo:false});
        this.props.closeParentModal();
    }

    render() {
        const {data} =this.props;
        return (
            <div>
                <Modal 
                show={this.state.showInfo}
                onHide={this.closeModel}
                >
                    <Modal.Header closeButton className='theme-bg'>
                        <Modal.Title>
                            <strong>Title:</strong> {data.title}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div>

                        
                          <div>
                            <strong>Content:</strong>
                            <div dangerouslySetInnerHTML={{__html : data.content}} /></div>
                          </div>
                       
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className='btn btn-default' onClick={this.closeModel}>Cancel</Button>
                    </Modal.Footer> 
                </Modal>
            </div>
            
        );
    }
}
export default InfoModal;