/* global _ */
import React, { Component } from "react";
import ImageModal from "../common/ImageModal";
import { Z_DEFAULT_STRATEGY } from "zlib";

class ImageCropper extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = {
      tmpSrc: "",
      src: "",
      showImage: false,
      invalidFile: false,
      invalidSize: false,
      invalidRes: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.getDataUrl = this.getDataUrl.bind(this);
  }

  onChange(e) {
    const { dimensionsCheck, id } = this.props;
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (files.length === 0) {
      return;
    }
    console.log("files[0].size", files[0].size);

    if (files[0].size > 5242880) {
      this.setState({ invalidSize: true });
      document.getElementById(id).value = "";
    } else if (
      !["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
        files[0].type
      )
    ) {
      this.setState({ invalidFile: true });
    } else if (dimensionsCheck) {
      const scope = this;

      const img = new Image();
      img.onload = function() {
        let { minHeight, minWidth } = scope.props;

        if (this.width < minWidth && this.height < minHeight) {
          scope.setState({ invalidRes: true });
          document.getElementById(id).value = "";
        } else if (this.height < minHeight) {
          scope.setState({ invalidRes: true });
          document.getElementById(id).value = "";
        } else if (this.width < minWidth) {
          scope.setState({ invalidRes: true });
          document.getElementById(id).value = "";
        } else {
          console.log(
            "else",
            this.width <= minWidth && this.height <= minHeight
          );
          scope.setState({
            invalidFile: false,
            invalidSize: false,
            invalidRes: false
          });
          const reader = new FileReader();
          reader.onload = e => {
            scope.setState({
              tmpSrc: reader.result,
              showImage: true,
              width: this.width,
              height: this.height
            });
          };
          reader.readAsDataURL(files[0]);
        }
      };
      img.src = window.URL.createObjectURL(files[0]);
    } else {
      this.setState({ invalidFile: false, invalidSize: false });
      const reader = new FileReader();
      reader.onload = e => {
        this.setState({ tmpSrc: reader.result, showImage: true });
      };
      reader.readAsDataURL(files[0]);
    }
  }

  toggleModal() {
    this.setState({ showImage: false });
    const { id } = this.props;
    if (this.state.tmpSrc) {
      document.getElementById(id).value = "";
    }
  }

  getDataUrl(data) {
    const {
      input: { onChange }
    } = this.props;
    const { id } = this.props;
    const { blob } = data;
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result, showImage: false });
    };

    reader.readAsDataURL(blob);
    document.getElementById(id).value = "";
    onChange(blob);
  }

  render() {
    const {
      logo,
      displayText,
      input,
      ratioUpper,
      ratioLower,
      id,
      minWidth,
      minHeight
    } = this.props;
    const { src, tmpSrc, showImage, invalidRes, invalidSize } = this.state;
    const fileInputKey = input.value ? input.value.name : +new Date();
    const imageStyle = {
      backgroundImage: "url(" + (src || logo) + ")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    };
    return (
      <div>
        {src && (
          <img
            src={src}
            alt=""
            width="120px"
            height="120px"
            className="img-responsive img-thumbnail i-bot"
          />
        )}
        {/* 	{src &&< div className="camera-icon" style={imageStyle}>
				<img src={src || logo} />
		</div>} */}

        <div className="form-control">
          <input
            type="file"
            key={fileInputKey}
            onChange={this.onChange}
            accept="image/*"
            id={id}
            /* 	id="upload-photo" */
          />
          <div className="camera-upload-content">
            {invalidSize && (
              <span className="invalidText" style={{ color: "#e73d4a" }}>
                maximum image size 5 mb
              </span>
            )}
          </div>
          <div className="camera-upload-content">
            {invalidRes && (
              <span
                className="invalidText"
                style={{
                  color: "#e73d4a",
                  position: "relative",
                  top: "5px",
                  left: "-11px"
                }}
              >{`Please select image with minimum resolution of ${minWidth} x ${minHeight} pixels`}</span>
            )}
          </div>

          <ImageModal
            open={showImage}
            src={tmpSrc}
            toggle={this.toggleModal}
            setDataUrl={this.getDataUrl}
            width={this.state.width}
            height={this.state.height}
            ratioUpper={ratioUpper}
            ratioLower={ratioLower}
            minWidth={minWidth}
            minHeight={minHeight}
          />
        </div>
      </div>
    );
  }
}

export default ImageCropper;
