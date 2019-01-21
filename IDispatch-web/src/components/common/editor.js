import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class EditorConvertToHTML extends Component {
    constructor(props) {
        super(props);        
        const html = this.props.content ? this.props.content:'<p></p>';
        const contentBlock = htmlToDraft(html);
       
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
       
            this.state = {
                editorState: editorState,
                content:html,
                codeDisplay:false
            };
        }
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.ontextChange = this.ontextChange.bind(this);
        this.findDomNodeHandler = this.findDomNodeHandler.bind(this);
    }

    onEditorStateChange (editorState) {
        let content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        this.setState({
            editorState: editorState,
        });
        /**to set field in redux form  */
        this.setState({ content: content})
        this.props.input.onChange(content);
        
    };

    ontextChange(e){
        this.setState({ content: e.target.value})
        const html = e.target.value;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ editorState: editorState}) 
        }
        this.props.input.onChange(e.target.value);
    }

    findDomNodeHandler() {  
        /**to toggle state  */
        this.setState({codeDisplay:!this.state.codeDisplay});

        /** to hide the editor*/
        var myDiv = document.getElementsByClassName('demo-editor rdw-editor-main');
        if (!this.state.codeDisplay)   ReactDOM.findDOMNode(myDiv[0]).style.display = 'none';        
        else  ReactDOM.findDOMNode(myDiv[0]).style.display = 'block'; 
         
    }
    render() {
        const { editorState, codeDisplay, content } = this.state;
        const {fieldName} =this.props;
        return (
            <div>   
                <label>{fieldName}</label>            
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor editor-scroll"                    
                    onEditorStateChange={this.onEditorStateChange}
                    toolbarCustomButtons={[<div className="rdw-option-wrapper" title="Code" onClick={this.findDomNodeHandler}>{"</>"}</div> ]}
                />
                {codeDisplay &&<textarea value={content}  className='form-control rem codearea' onChange={ this.ontextChange}/>}
            </div>
        );
    }
}

export default EditorConvertToHTML;