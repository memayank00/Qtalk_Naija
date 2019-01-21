import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
/* import 'cropperjs/dist/cropper.css'; */




class ImageModal extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      	isCropping: false	      	
	    };
	    this.cropImage = this.cropImage.bind(this);
		this.onExit = this.onExit.bind(this);
		this.updateWidth = this.updateWidth.bind(this);
	}
	onExit() {
		this.setState({isCropping: false})
		 this.props.toggle();
	}

	crop = e => {
		
		if (
				e.detail.width < 623 &&
				e.detail.height < 525
		) {
				this.refs.cropper.cropper.setData(
						Object.assign({}, e.detail, {
								width:
										e.detail.width < this.props.cropWidth
												? this.props.cropWidth
												: e.detail.width,
								height:
										e.detail.height < this.props.cropHeight
												? this.props.cropHeight
												: e.detail.height
						})
				);
		}

		return;
};
	cropImage(e) {
		console.log("eee",e)
		const {setDataUrl} = this.props;
    	if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      		return;
		}
		this.setState({isCropping: true})
		
		if (!HTMLCanvasElement.prototype.toBlob) {
			
			Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
				value: function (callback, type, quality) {
				var canvas = this;
				setTimeout(function() {

					var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
						len = binStr.length,
						arr = new Uint8Array(len);

					for (var i = 0; i < len; i++ ) {
						arr[i] = binStr.charCodeAt(i);
					}

					callback( new Blob( [arr], {type: type || 'image/png'} ) );

				});
				}
			});
		}
    	this.cropper.getCroppedCanvas().toBlob(  (blob) => setDataUrl({blob}));
    	//this.setState({cropResult: this.cropper.getCroppedCanvas().toDataURL()});
	  }
	  
	  updateWidth() {
		 
			let ele = document.querySelector('.modal-lg.modal-dialog');
			console.log(this.props);
			ele.style.width = `${this.props.width}px`;
			// ele.style.height = this.props.height;

		//   setTimeout(()=>{
		// 	ele.style.width =this.props.width;
		// 	ele.style.height =this.props.height;
		//   },500)
		
	  }

	 
  	render() {
  			
		  const {open, toggle, src,width,height,ratioUpper,ratioLower,minHeight,minWidth} = this.props;
		  const {isCropping} = this.state;

		  var ratioUpperCalculatedSize = 0;
		  var ratioLowerCalculatedSize = 0;
		  if(this.props.imagetype && this.props.imagetype == 'gallery'){
		  	 ratioUpperCalculatedSize = ratioUpper/3;
		  	 ratioLowerCalculatedSize = ratioLower/3;
		  }

	    return (
    <div>
	
				<Modal 
				id="lg-modal"
				show={open}
			/* 	onEntered={this.updateWidth} */
				onHide={this.onExit}
				onExit={this.onExit}
				backdrop={'static'}
				bsSize = {'lg'}
							
                >
                    <Modal.Header closeButton className='theme-bg'>
                        <Modal.Title>
						Crop Image
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body >
					{

						<Cropper
					style={{width:width,height:height,maxWidth:"900px",maxHeight:"400px",margin:"auto" }}
						// autoCropArea={0.9}
						aspectRatio={ratioUpper/ratioLower}
	                    guides={false}
	                    src={src}
	                    /*minCanvasWidth={width}
	                    minCanvasHeight={height}
	                    maxCanvasWidth={width}
	                    maxCanvasHeight={height}
*/

						viewMode={1}
						minCropBoxHeight={ratioUpper+ratioLowerCalculatedSize}
						minCropBoxWidth={ratioLower+ratioUpperCalculatedSize}
						maxCropBoxHeight={ratioUpper+ratioLowerCalculatedSize}
						maxCropBoxWidth={ratioLower+ratioUpperCalculatedSize}
						
						zoomable={false}
						autoCropArea={0}
						cropBoxResizable={true}
	                    ref={cropper => { this.cropper = cropper; }}


					/>

				
 
				 		}

					
                    </Modal.Body>

                    <Modal.Footer>
					<Button color="primary" onClick={this.cropImage} disabled={isCropping}>{isCropping ? 'Cropping ...' :'Crop'}</Button>{' '}
	            	<Button color="secondary" onClick={toggle}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>

			
		);
	
  	}
}

export default ImageModal;
