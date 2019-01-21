import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { push } from "react-router-redux";
import { toast } from "react-toastify";
import HTTP from "../../services/http";
import FileInput from "../common/FileInput";
import { required, ValidateOnlyAlpha } from "../common/fieldValidations";

/**COMPONENT */
/* import RenderFiled from "../common/renderField"; */
import PageHeader from "../common/pageheader";
/* import Multiselect from "../common/multiselect"; */
import Loader from "../common/loader";
/* import DropdownComp from "../common/DropdownList"; */
/* import infoOf from "../common/tooltip-text"; */

/**CONSTANT DATA */
import { OPTIONS } from "../common/options";

class importPages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            formAction: "ADD",
            status: true
        };
        /**event binding  */
        this.formSubmit = this.formSubmit.bind(this);
    }

    componentWillMount() {}

    render() {
        const { handleSubmit } = this.props;
        const { isLoading, formAction, status } = this.state;
        return (
            <div>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        <PageHeader
                            route={
                                formAction === "ADD" ? "Import" : "Edit Role"
                            }
                            parent="Pages"
                            parentRoute="/pages"
                        />

                        <div className="tab-pane active">
                            <form onSubmit={handleSubmit(this.formSubmit)}>
                                <Field
                                    name="image"
                                    placeholder="Enter State"
                                    fieldName="State*"
                                    type="file"
                                    component={FileInput}
                                    validate={[required, ValidateOnlyAlpha]}
                                />
                                <br />
                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn green uppercase"
                                        disabled={
                                            this.props.invalid ||
                                            this.props.submitting
                                        }
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    formSubmit(values) {
        
        let formData = new FormData();
        formData.append("file", values.image);
        this.setState({ isLoading: true });
        HTTP.Request("post", window.admin.importCMS, formData)
            .then(result => {
                this.props.dispatch(push("/pages"));
                toast(result.message, { type: "success" });
                this.setState({ isLoading: false });
            })
            .catch(error => {
                toast(error.message, { type: "error" });
                this.setState({ isLoading: false });
            });
    }
}

//decorate form component
let PageMang_Form = reduxForm({
    form: "Pagemport_Form"
})(importPages);

export default PageMang_Form;
