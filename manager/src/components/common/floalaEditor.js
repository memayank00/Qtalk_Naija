import React, { Component } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import HTTP from "../../services/http";
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
class FroalaEditorComp extends Component {
    constructor(props) {
        super(props);
        /**event binding */
        this.onChange = this.onChange.bind(this);
    }

    /**this function will call evevrytime you write on editor */
    onChange(event) {
        this.props.input.onChange(event);
    }

    deleteFile(e, editor, img){
        let url=img.attr('src');
        HTTP.Request("post", window.admin.deleteImagesFro,{url:url})
            .then(result => {
               console.log(result)
            })
            .catch(error => {
               console.log(error)
            });
    }

    render() {
        const { input, fieldName} =this.props;
        let config = {
            placeholder: "Edit Me",
      }
      
        return (<div>
            <label>{fieldName}</label>
                <FroalaEditor
                    tag='textarea'
                    config={
						{
                        placeholderText: 'Enter your text here!',
                        heightMin: 200,
                        heightMax: 300,
                        /* tableStyles: {
                            gallery_inner: 'URL Orange',
                            class2: 'Class 2',
                            class3: 'Class 3'
                          }, */
                          tableCellStyles: {
                            gallery_inner: 'URL CSS'
                            
                          },
                        // fileUpload:false,
                        events : {
                            'froalaEditor.initialized': this.onInit,
                            'froalaEditor.image.removed':this.deleteFile,
                            // 'froalaEditor.image.beforeUpload':this.uploadFile,
                        },
                        charCounterCount: true,
                            // Set the image upload parameter.
                            imageUploadParam: 'file',
                            
                            // Set the image upload URL.
                            imageUploadURL:  window.admin.uploadImagesFlo,
                    
                            // Additional upload params.
                            imageUploadParams: {id: 'my_editor'},
                    
                            // Set request type.
                            imageUploadMethod: 'POST',
                    
                            // Set max image size to 5MB.
                            imageMaxSize: 2 * 1024 * 1024,
                    
                            // Allow to upload PNG and JPG.
                            imageAllowedTypes: ['jpeg', 'jpg', 'png'],
						}
					}
                    model={input.value}
                    onModelChange={this.onChange}
                />
        </div>
           
        )
    }
}

export default FroalaEditorComp;