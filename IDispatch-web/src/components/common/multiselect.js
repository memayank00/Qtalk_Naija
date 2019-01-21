import React from 'react';
import Select from 'react-select';
import {  HelpBlock } from 'react-bootstrap';
/**CSS */
import 'react-select/dist/react-select.css';

/**components... */
import TT from './tooltip';

class Multiselect extends React.Component{

    constructor(props){
        super(props);

        this.state={
            disabled: false,
            clearable: true,
            rtl: false,
            selectValue: this.props.multi  ? this.props.selectedValues : this.props.selectedValues[0]
        }
        /**to set value in the field */
        if (!this.props.multi) this.props.input.onChange(this.props.selectedValues[0]);
        /**bind */
        this.updateValue = this.updateValue.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.click = this.click.bind(this);
    }

   /** to get options Async */
    getOptions() {
        const { statusBased , options } = this.props;
        var optionsChk = new Promise(
            (resolve, reject) => {
                if (options) {
                    setTimeout(() => {
                        /**for returning options having status true */
                        if (statusBased) resolve(options.filter( e => e.status)) 
                        /**for returing all options */
                        else resolve(options) 
                    }, 1000);

                } else {
                    reject("err"); // reject
                }

            }
        );
        return optionsChk.then(data => { return { options: data } })
            .catch(err => { return err })

    }

    updateValue(newValue) {
     
        this.setState({
            selectValue: newValue,
        });
         /** redux onchange method  */
        /**to send only id on server */
        if(this.props.multi){
            let array = newValue.map((element) => {
                return element._id
            })
            if (array.length <= 0) this.props.input.onChange(null);
            else this.props.input.onChange(array);
        }else {

            // if(newValue) this.props.input.onChange(valueKey?newValue[valueKey]:newValue);
             this.props.input.onChange(newValue);
        }
    }

    render() {
        const { valueKey, labelkey, multi, meta: { error }, fieldName, icon, tooltip} = this.props;
        const { touched, selectValue} =this.state;

        return (
            <div className="section form-group">
                <label>{fieldName} 
                    <TT tooltip={tooltip || null}> {icon && <i className={icon}></i>} </TT>
                </label>
                <Select.Async
                    multi={multi ? true : false}
                    onBlur={this.click}
                    value={selectValue}
                    onChange={this.updateValue}
                    valueKey={valueKey ? valueKey:"_id"}
                    labelKey={labelkey ? labelkey:"title"}
                    loadOptions={this.getOptions} />
                    
                <HelpBlock style={{color: '#e73d4a'}}>
                    {touched &&  error ? error : null}
                </HelpBlock>
            </div>
        );
    }

    click(r) {
       this.setState({touched:true})
    }
}

export default Multiselect;