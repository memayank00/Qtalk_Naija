import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { push } from "react-router-redux";
import { toast } from "react-toastify";
import HTTP from "../../services/http";
import { Tabs, Tab } from "react-bootstrap";

import {
    required,
    ValidateOnlyAlpha,
    slugValidation
} from "../common/fieldValidations";

/**COMPONENT */
import RenderField from "../common/renderField";
import PageHeader from "../common/pageheader";
import DropdownComp from "../common/DropdownList";
/* import Editor from "../common/editor"; */
import Loader from "../common/loader";
import Revisions from "./element/revisions";
import { ADMIN_TRACK_AUDIT_LOGS } from "../common/actions";
import infoOf from "../common/tooltip-text";
import DatePicker from "../common/DateTimePicker";
import { slugify } from "../../libs/Helper";
import FroalaEditorComp from "../common/floalaEditor";

class AddBlog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            revisions: [],
            content: "",
            isLoading: false,
            formAction: "ADD",
            status: true,
            image: "",
            isDeleting: false
        };
        /**event binding  */
        this.upsertCMS = this.upsertCMS.bind(this);
        this.getaCMS = this.getaCMS.bind(this);
        this.getFile = this.getFile.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        this.getaCMS();
    }

    render() {
        const { handleSubmit } = this.props;
        const { isLoading, formAction, status } = this.state;
        return (
            <div className="relative">
                {isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        <PageHeader
                            route={
                                formAction === "ADD"
                                    ? "Add New Blog"
                                    : "Edit Blog"
                            }
                            parent="Blogs"
                            parentRoute="/blogs"
                        />

                        <div className="tab-pane active">
                            <Tabs
                                defaultActiveKey={1}
                                animation={false}
                                id="profileTabs"
                            >
                                <Tab
                                    eventKey={1}
                                    title={
                                        formAction === "ADD"
                                            ? "Add New Blog"
                                            : "Edit Blog"
                                    }
                                >
                                    <form
                                        onSubmit={handleSubmit(this.upsertCMS)}
                                    >
                                        <Field
                                            name="title"
                                            fieldName="Title*"
                                            type="text"
                                            component={RenderField}
                                            onChange={this.onChange}
                                            validate={[
                                                required,
                                                ValidateOnlyAlpha
                                            ]}
                                        />
                                        {
                                            <Field
                                                name="slug"
                                                fieldName="Custom URL*"
                                                type="text"
                                                component={RenderField}
                                                validate={[
                                                    required,
                                                    slugValidation
                                                ]}
                                            />
                                        }

                                        <label>Featured Image</label>
                                        <input
                                            type="file"
                                            onChange={this.getFile}
                                            accept="image/*"
                                            className="form-control"
                                        />
                                        <br />

                                        {this.state.image ? (
                                            <div>
                                                <img
                                                    src={
                                                        this.state.image
                                                            .secure_url
                                                    }
                                                    alt=""
                                                    width="120px"
                                                    className="img-responsive img-thumbnail i-bot"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn green uppercase"
                                                    onClick={this.removeImage}
                                                    disabled={
                                                        this.state.isDeleting
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : null}

                                        <Field
                                            name="summary"
                                            textarea
                                            fieldName="Summary"
                                            component={RenderField}
                                        />
                                        <Field
                                            name="content"
                                            fieldName="Content"
                                            type="text"
                                            component={FroalaEditorComp}
                                            content={this.state.content}
                                        />

                                {/* <Field name="order" icon='fa fa-info-circle' tooltip={infoOf.order} fieldName="Order" type="number" component={RenderFiled} />   */}
                                        
                                        <Field
                                            name="meta_title"
                                            icon="fa fa-info-circle"
                                            tooltip={infoOf.meta_title}
                                            fieldName="Meta Title*"
                                            type="text"
                                            component={RenderField}
                                            validate={[required]}
                                        />
                                        <Field
                                            name="meta_description"
                                            textarea
                                            fieldName="Meta Description"
                                            component={RenderField}
                                            className="form-control"
                                        />

                                        <Field
                                            name="status"
                                            options={[
                                                {
                                                    label: "Active",
                                                    value: true
                                                },
                                                {
                                                    label: "In-Active",
                                                    value: false
                                                }
                                            ]}
                                            label="Status"
                                            defaultValue={
                                                status ? "Active" : "In-Active"
                                            }
                                            textField="label"
                                            valueField="value"
                                            component={DropdownComp}
                                        />
                                        <Field
                                            name="blog_post_date"
                                            component={DatePicker}
                                            fieldName="Blog posted date"
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
                                                {formAction === "ADD"
                                                    ? "Add"
                                                    : "Update"}
                                            </button>
                                        </div>
                                    </form>
                                </Tab>
                                {/*<Tab eventKey={2} title="Revisions">
                                    <Revisions
                                        revisions={this.state.revisions}
                                    />
                                </Tab>*/}
                            </Tabs>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    onChange(event) {
        const { change } = this.props;
        if (event.target.value) {
            change("slug", slugify(event.target.value));
        }
    }

    upsertCMS(data) {
        const { match } = this.props;
        this.setState({ isLoading: true });
        /*bind type of Post*/
        data.type = "blog";
        delete data.image;
        if (match.params._id) data.editID = match.params._id;

        let formData = new FormData();
        /*add file to request*/
        formData.append("file", this.state.file);
        formData.append("data", JSON.stringify(data));

        this.props.dispatch({
            type: "Admin-upsertCMS",
            data: formData,
            success: r => {
                this.props.dispatch(push("/blogs"));
                toast.success(r.message);
                this.setState({ isLoading: false });
                /*log audits for user*/
                this.props.dispatch({
                    type: ADMIN_TRACK_AUDIT_LOGS,
                    action: {
                        comment:
                            "Modified the content of Blog - " + r.data.title,
                        type: "audit"
                    }
                });
            },
            error: e => {
                if (e.errors) {
                    this.setState({ isLoading: false });
                    e.errors.map(error => toast(error, { type: "error" }));
                }
            }
        });
    }

    getFile(e) {
        this.setState({ file: e.target.files[0] });
    }

    getaCMS() {
        const { match, initialize } = this.props;
        /*extract plant id from request*/
        let cmsID = match.params._id ? match.params._id : null;

        if (cmsID) {
            this.setState({ isLoading: true, formAction: "EDIT" });
            HTTP.Request("get", window.admin.getaCMS, { _id: cmsID }).then(
                result => {
                    this.setState({
                        isLoading: false,
                        status: result.data.data.status,
                        content: result.data.data.content
                            ? result.data.data.content
                            : "",
                        image: result.data.data.image
                            ? result.data.data.image
                            : "",
                        revisions: result.data.revisions
                            ? result.data.revisions
                            : []
                    });
                    /*set data to form*/
                    initialize(result.data.data);
                }
            );
        }
    }
    removeImage() {
        const { match, change } = this.props;
        /*extract plant id from request*/
        let cmsID = match.params._id ? match.params._id : null,
            request = {
                cmsID,
                image: this.state.image
            };
        this.setState({ isDeleting: true });
        HTTP.Request("post", window.admin.removeBlogImage, request)
            .then(response => {
                this.setState({ image: "", isDeleting: false });
            })
            .catch(e => {
                if (e.errors) {
                    this.setState({ isDeleting: false });
                    e.errors.map(error => toast(error, { type: "error" }));
                }
            });
    }
}

//decorate form component
let AddBlog_Form = reduxForm({
    form: "AddBlog_Form "
})(AddBlog);

export default AddBlog_Form;
