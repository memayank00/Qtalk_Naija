import React, { Component } from "react";
import { connect } from "react-redux";

class IMG extends Component{
    constructor(){
        super();
        this.placeholder = "http://placehold.it/150x150";
    }
    render() {
        const { src, className, id, alt } = this.props;
        return(
            <img src={src ? src : this.placeholder} id={id} className={className} alt={alt} />
        );
    }
}

export default connect()(IMG);