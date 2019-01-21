import React from 'react'
import { FormGroup, ControlLabel } from "react-bootstrap";

class FileInput extends React.Component {
    constructor(props) {
      super(props);
      this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
      const { input: { onChange } } = this.props;
      onChange(e.target.files[0])
    }

    render() {

      const { className, label } = this.props;

      return (
        <FormGroup>
          <ControlLabel>{label}</ControlLabel>
          <input type="file" className={className} onChange={this.onChange}  />
          <span className="brseBtnNW yellobtn">Browse</span>
        </FormGroup>
      );
    }
}

export default FileInput