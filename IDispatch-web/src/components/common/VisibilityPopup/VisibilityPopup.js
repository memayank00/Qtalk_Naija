import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './VisibilityPopup.css';
class ModalExample extends React.Component {
  render() {
    const {show,toggle} = this.props;
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal  isOpen={show} toggle={toggle} className={this.props.className} className="Visiblity_ModalOuter">
          <ModalHeader toggle={toggle}>
              <div className="modalLogo">
                <span>Visibility</span>
              </div>
          </ModalHeader>
          <ModalBody>
            <div className="VisibilityList">
                <i><img src="/assets/images/view-icon1.png" /></i>
                <strong>Visibility On</strong>
                <p>Lorem ipsum dolor sit amet, gra.</p>
                <span><img src="/assets/images/right_check.png" /></span>
            </div>
            <div className="VisibilityList">
                <i><img src="/assets/images/view-icon2.png" /></i>
                <strong>Visibility Off</strong>
                <p>Lorem ipsum dolor sit amet, gra.</p>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ModalExample;