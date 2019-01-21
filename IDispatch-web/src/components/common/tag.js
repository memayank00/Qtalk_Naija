import React from 'react';
import Select from 'react-select';
import { FormGroup,  HelpBlock } from 'react-bootstrap';
import { ValidateIPaddress} from "./fieldValidations";
import TT from "./tooltip";
class Tag extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            /**to show saved IPS */
            multiValue: this.props.savedIP ? this.props.savedIP:undefined           
        };
        /**to set value in the field */
        this.props.input.onChange(this.props.savedIP); 
        /**bind event */
        this.handleOnChange = this.handleOnChange.bind(this);
        this.click = this.click.bind(this);
    }

    handleOnChange(value) {       

        /**check if the last entered value is correct ip address or not */
        let IPCheck = value.length >0 ? ValidateIPaddress(value.slice(-1)[0].value) :undefined;

        /**if user trying to enter invalid IP */
        if (IPCheck){
            /**to remove invalid ip value  */
            value.pop();
            this.setState({ hint: IPCheck})  ;

            /**to remove hint message */
            setTimeout(() => {
                this.setState({ hint: undefined })  
            }, 2000);
        }
        /**if Everything is ok */
        else {
            /**TO SET VALUE IN STATE */
            this.setState({ multiValue: value });

            /**to send value in redux form */
            if (value.length <= 0) this.props.input.onChange(null);   //to disable submit button       
            else this.props.input.onChange(value);
        }

    }

    click(r) {
        this.setState({ touched: true })
    }

    render() {
        const { multiValue, hint, touched, } = this.state;
        const {  meta: { error } ,fieldName, tooltip, icon} = this.props;

        return (
            <div className="section">

                <FormGroup validationState={!true? null :  "error" }>    

                    <label>{fieldName}
                        <TT tooltip={tooltip || null}> {icon && <i class={icon}></i>} </TT>
                    </label><br />           
                        <Select.Creatable
                        className="hide-options"
                        multi={true}
                        placeholder="Add..."                         
                        onChange={this.handleOnChange}
                        value={multiValue }  
                        onBlur={this.click}                   
                        />
                    <HelpBlock style={{ color: '#e73d4a' }}>
                        {touched && hint ? hint : null}
                        {touched && error ? error : null}
                    </HelpBlock>
                </FormGroup>              
            </div>
        );
    }
}

export default Tag;
