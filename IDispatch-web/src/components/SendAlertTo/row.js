import React, { Component } from 'react';
import { Field, reset,SubmissionError} from "redux-form";
import FormField from "../common/renderField";
import DefaultImage from "../../assets/images/img_avatar_default.png";
class ROW extends Component{
    constructor(props){
        super(props);
        this.state={
            days:[]
        }
    }
    render(){
        const {list,remove,openConirmationPopUP}=this.props;
        const {days}=this.state;
        return(
            <div className="chatting-user-box">
                  <img src={list.profilePicture ?list.profilePicture:DefaultImage} alt="" />
                  <div className="chatting-user-list-text">
                    <h5>{list.name}</h5>
                    <p>{list.location ?`${list.location.substring(0,40)}...`:""}</p>
                    <div className="checkb-box">
                      <label htmlFor="box1">
                        <Field  type="checkbox"
                            name={`${days}[${list._id}]`}
                            value={true}
                            checked={true}
                            component={FormField}
                        />
                      </label>
                    </div>
                  </div>
                </div>
        )

    }

}

export default ROW;