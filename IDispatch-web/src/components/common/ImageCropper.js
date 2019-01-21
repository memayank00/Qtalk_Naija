/* global _ */
import React, {Component} from 'react';
/* import CameraImage from '../../assets/images/photo-camera.png'; */
/* import DeleteImage from '../../assets/images/svg/delete-button.svg'; */
import EditImage from '../../assets/images/pencil-edit-button.png';
import ImageModal from './ImageModal';

class ImaegCropper extends Component {
	constructor() {
		super();
		this.onChange = this.onChange.bind(this);
      	this.toggleModal = this.toggleModal.bind(this);
      	this.getDataUrl = this.getDataUrl.bind(this);
      	this.state = {
      		tmpSrc: '',
      		src: '',
      		invalidFile:false,
      		invalidSize:false,
      		showImage: false,
      	}
	}
	toggleModal() {
    	this.setState({showImage: false});
    	if( this.state.tmpSrc ) {
    		document.getElementById("upload-photo").value = "";
    	}
    }
	onChange(e) {
		const {dimensionsCheck} = this.props;
	    let files;
	    if (e.dataTransfer) {
	      	files = e.dataTransfer.files;
	    } else if (e.target) {
	      	files = e.target.files;
	    }
	    if(files.length === 0) {
	    	return;
	    }
	
	    if(files[0].size > 1000000) {
			this.setState({ invalidSize: true });
			document.getElementById("upload-photo").value = "";
	    } else if(!['image/jpeg','image/jpg','image/png','image/gif'].includes(files[0].type)) {
			this.setState({ invalidFile: true });
			document.getElementById("upload-photo").value = "";
	    }else {
	    	this.setState({ invalidFile: false, invalidSize: false });	
	    	const reader = new FileReader();
	    	reader.onload = (e) => {
	    		this.setState({ tmpSrc: reader.result, showImage: true});	
	    	};
	    	reader.readAsDataURL(files[0]);	
	    }
    }
    getDataUrl(data) {
    	const { input: { onChange } } = this.props;
    	const {blob} = data;
    	const reader = new FileReader();
	    reader.onload = () => {
	      	this.setState({ src: reader.result, showImage: false});
	    };
	    
	    reader.readAsDataURL(blob);
	    document.getElementById("upload-photo").value = "";
	    onChange(blob);
    }
    
    
	render() {
		const { input,updateProfileImage} = this.props;
		const {src, tmpSrc, showImage, invalidFile, invalidSize} = this.state;
		
		const fileInputKey = input.value ? input.value.name : +new Date();
		return (
			<div>
				<div className="form-group">
				 
				      
					<label className="edit-icon">
					<img src={EditImage} alt="Edit"/>
					
					<input className="edit-input"
				            	type="file" 
				            	key={fileInputKey} 
				            	onChange={this.onChange} 
				            	accept="image/*"
				            	id="upload-photo" />
  </label>
				 
				 
				 
				    <div className="camera-upload-content">
				        {invalidSize&&<span >maximum image size 1 mb.</span>}
				        {invalidFile && <span className="invalidText">select image of type jpg, jpeg, png or gif</span>}
				    </div> 
				</div>
				<ImageModal open={showImage} src={tmpSrc} toggle={this.toggleModal} setDataUrl={this.getDataUrl} updateProfileImage={updateProfileImage}/>
			</div>
		)
	}
}

export default ImaegCropper;