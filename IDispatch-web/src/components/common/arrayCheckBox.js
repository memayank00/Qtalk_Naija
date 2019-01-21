import React, { Component ,Fragment} from 'react';
/**props type checking */
import PropTypes from 'prop-types';
import DefaultImage from "../../assets/images/img_avatar_default.png";

class CheckBoxGroup extends Component {
    constructor(props) {
        super(props);
        /**initialize the selected options */
        this.selected=this.props.selcetedByProps || [];
        this.change = this.change.bind(this);
        this.applyCheck=this.applyCheck.bind(this);
    }
    /**to apply check on selected */
    applyCheck(nextProps) {
        setTimeout(() => {
        let checkboxs = document.querySelectorAll('.checkbox-group input[type=checkbox]');
        checkboxs.forEach((ele, key) => {
            let value = ele.getAttribute('value');
                nextProps.selcetedByProps.map((node, index) => {
                if( value == node._id) {
                    ele.checked = true;
                }
            });                
        })
        }, 1000);
    };

   componentWillReceiveProps(nextProps){
       console.log("called")
       this.applyCheck(nextProps); 
   }
    /**this function will called if the state of checkbox changes */
    change(element) { 
        console.log("selcted before", this.selected)              
        let index = this.selected.findIndex(x => x._id == element._id);
        /**if present then remove from slected array */
        if(index>-1) this.selected.splice(index,1)
        /**otherwise push the array */
        else this.selected.push(element)
        console.log("selcted after-->", this.selected)                
        this.props.input.onChange(this.selected);     
    }
    render() {            
        const { options, labelClass} =this.props;    
        return (
            <div className="checkbox-group">
                {options.map((e)=>{   
                    
                    return  <div className="chatting-user-box">
                    <img src={e.profilePicture} onError={(e)=>{e.target.src = DefaultImage}} alt="" />
                    <div className="chatting-user-list-text">
                      <h5>{e.name}</h5>
                      <p>{e.location ?`${e.location.substring(0,40)}...`:""}</p>
                      <div className="checkb-box">
                    <label className={labelClass} key={e._id}>{e.title}
                    <input type="checkbox" onChange={() => this.change(e)}
                            value={e._id}  />
                        <span className="checkmark"></span>
                    </label>
                    </div>
                    </div>
                  </div>
                })}
             </div>
        )
    }
    /* Called immediately after a compoment is mounted.
    Setting state here will trigger re - rendering. */
    componentDidMount() {
        /**to send value in reduxfield */
        this.props.input.onChange(this.selected);
    }
}
/**to check datatype of props */
CheckBoxGroup.propTypes = {
    checkBoxValue: PropTypes.string.isRequired,//value return by the checkbox
    labelClass: PropTypes.string,//css calss want to apply on the label of checkbox
    options: PropTypes.array,//array of options 
    selcetedByProps: PropTypes.array,//preselected options
};
CheckBoxGroup.defaultProps = {
    /**default css class of checkbox label */
    labelClass: "dashboard-checkbox-container",
    options:[],
    selcetedByProps:[],
};
export default CheckBoxGroup;