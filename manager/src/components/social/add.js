import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { push } from "react-router-redux";
import { toast } from "react-toastify";
import HTTP from "../../services/http";
import { Tabs, Tab } from "react-bootstrap";
import ImageCropper from "../common/ImageCropper";
import {
  required,
  ValidateOnlyAlpha,
  sfValidation,
  customer_summin,
  customer_summax,
  customer_titlemax,
  customer_titlemin,
  customer_secmin,
  customer_sec2min,
  customer_quote,
  customer_quotemin,
  customer_quotemax
} from "../common/fieldValidations";
/* import FroalaEditorComp from "../common/floalaEditor"; */
import { slugify } from "../../libs/Helper";
/**COMPONENT */
import RenderFiled from "../common/renderField";
import PageHeader from "../common/pageheader";
import Loader from "../common/loader";
import DropdownComp from "../common/DropdownList";
import Revisions from "./element/revisions";
import TT from "../common/tooltip";
/**CONSTANT DATA */
import { STATUS, stateList, BED, BATH } from "../common/options";

import { ADMIN_TRACK_AUDIT_LOGS } from "../common/actions";
import infoOf from "../common/tooltip-text";
class UpsertSocial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      revisions: [],
      isLoading: false,
      formAction: "ADD",
      status: true
    };

    /**event binding  */
    this.upsertCMS = this.upsertCMS.bind(this);
    this.getaCMS = this.getaCMS.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.getaCMS();
  }

  onChange(event) {
    const { change } = this.props;
    if (event.target.value) {
      change("slug", slugify(event.target.value));
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const { isLoading, formAction } = this.state;
    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <PageHeader
              route={
                formAction === "ADD"
                  ? "Add Customer Stories"
                  : "Edit Customer Stories"
              }
              parent="Customer Stories"
              parentRoute="/social"
            />

            <div className="tab-pane active">
              <Tabs defaultActiveKey={1} animation={false} id="profileTabs">
                <Tab
                  eventKey={1}
                  title={
                    formAction === "ADD"
                      ? "Add New Customer Stories"
                      : "Edit Customer Stories"
                  }
                >
                  <form onSubmit={handleSubmit(this.upsertCMS)}>
                    <Field
                      name="title"
                      fieldName="Title*"
                      type="text"
                      icon="fa fa-info-circle"
                      tooltip={infoOf.customer_title}
                      component={RenderFiled}
                      onChange={this.onChange}
                      validate={[
                        required,
                        ValidateOnlyAlpha,
                        customer_titlemax,
                        customer_titlemin
                      ]}
                    />

                    <Field
                      name="slug"
                      icon="fa fa-info-circle"
                      tooltip={infoOf.customer_title}
                      fieldName="Custom URL*"
                      type="text"
                      component={RenderFiled}
                      validate={[required]}
                    />

                    {/*    <Field name="custom_link" icon='fa fa-info-circle' tooltip={infoOf.customer_title} fieldName="Link" type="url" component={RenderFiled} validate={[required]}/> */}

                    <br />
                    <label>
                      Image for Summary Page*
                      <TT tooltip={infoOf.customer_title}>
                        {" "}
                        <i className="fa fa-info-circle" />
                      </TT>
                    </label>
                    <Field
                      component={ImageCropper}
                      id={"Listing_Image"}
                      name="image"
                      minWidth={620}
                      minHeight={500}
                      dimensionsCheck={true}
                      ratioUpper={672}
                      ratioLower={533}
                    />
                    <br />
                    {this.state.image ? (
                      <img
                        src={this.state.image.secure_url}
                        alt=""
                        width="120px"
                        className="img-responsive img-thumbnail i-bot"
                      />
                    ) : null}

                    <Field
                      textarea
                      name="summary"
                      icon="fa fa-info-circle"
                      tooltip={infoOf.customer_title}
                      component={RenderFiled}
                      fieldName="Summary"
                      validate={[customer_summax, customer_summin]}
                    />
                    <Field
                      name="section_one"
                      icon="fa fa-info-circle"
                      tooltip={infoOf.customer_title}
                      textarea
                      fieldName="Section One Text*"
                      type="text"
                      component={RenderFiled}
                      validate={[required, customer_secmin]}
                    />
                    <Field
                      name="section_two"
                      textarea
                      icon="fa fa-info-circle"
                      tooltip={infoOf.customer_title}
                      fieldName="Section Two Text*"
                      type="text"
                      component={RenderFiled}
                      validate={[required, customer_sec2min]}
                    />
                    <Field
                      name="review_text"
                      textarea
                      icon="fa fa-info-circle"
                      tooltip={infoOf.customer_title}
                      fieldName="Quotation under image*"
                      type="text"
                      component={RenderFiled}
                      validate={[
                        required,
                        customer_quote,
                        customer_quotemin,
                        customer_quotemax
                      ]}
                    />
                    <br />
                    <div className="row">
                      <div className="col-sm-6">
                        <Field
                          name="name"
                          icon="fa fa-info-circle"
                          tooltip={infoOf.customer_title}
                          fieldName="Customer Name*"
                          type="text"
                          component={RenderFiled}
                          validate={[required]}
                        />
                      </div>
                      <div className="col-sm-3">
                        <Field
                          name="extra_classes"
                          fieldName="City*"
                          type="text"
                          component={RenderFiled}
                          validate={[required]}
                        />
                      </div>
                      <div className="col-sm-3">
                        <Field
                          name="state"
                          options={stateList}
                          label="State"
                          defaultValue={"VA"}
                          textField="title"
                          valueField="value"
                          component={DropdownComp}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-2">
                        <Field
                          name="address_summary"
                          options={BED}
                          label="Bed*"
                          defaultValue={"0"}
                          textField="title"
                          valueField="value"
                          component={DropdownComp}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Field
                          name="bath"
                          options={BATH}
                          label="Bath*"
                          defaultValue={"1"}
                          textField="title"
                          valueField="value"
                          component={DropdownComp}
                        />
                      </div>
                      <div className="col-sm-2">
                        <Field
                          name="sf"
                          icon="fa fa-info-circle"
                          tooltip={infoOf.customer_title}
                          component={RenderFiled}
                          fieldName="Area(SF)*"
                          validate={[required, sfValidation]}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label>
                          {" "}
                          Body Image*
                          <TT tooltip={infoOf.customer_title}>
                            {" "}
                            <i className="fa fa-info-circle" />
                          </TT>
                        </label>
                        <Field
                          component={ImageCropper}
                          name="body_image"
                          id={"Body_Image"}
                          minWidth={950}
                          minHeight={600}
                          dimensionsCheck={true}
                          ratioUpper={960}
                          ratioLower={600}
                          validate={formAction === "ADD" ? [required] : []}
                        />
                        <br />
                        {this.state.body_image ? (
                          <img
                            src={this.state.body_image.secure_url}
                            alt=""
                            width="120px"
                            className="img-responsive img-thumbnail i-bot"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <label>
                          {" "}
                          Featured Image*
                          <TT tooltip={infoOf.customer_title}>
                            {" "}
                            <i className="fa fa-info-circle" />
                          </TT>
                        </label>
                        <Field
                          dimensionsCheck={true}
                          component={ImageCropper}
                          name="featured_image"
                          id={"Featured_Image"}
                          minWidth={1600}
                          minHeight={640}
                          ratioUpper={1600}
                          ratioLower={640}
                          validate={formAction === "ADD" ? [required] : []}
                        />
                        <br />
                        {this.state.featured_image ? (
                          <img
                            src={this.state.featured_image.secure_url}
                            alt=""
                            width="120px"
                            className="img-responsive img-thumbnail i-bot"
                          />
                        ) : null}
                      </div>
                      <div className="col-sm-6">
                        <label>
                          {" "}
                          Property Image*
                          <TT tooltip={infoOf.customer_title}>
                            {" "}
                            <i className="fa fa-info-circle" />
                          </TT>
                        </label>
                        <Field
                          component={ImageCropper}
                          id={"Property_Image"}
                          name="title_image"
                          minWidth={250}
                          minHeight={250}
                          dimensionsCheck={true}
                          ratioUpper={250}
                          ratioLower={250}
                          validate={formAction === "ADD" ? [required] : []}
                        />
                        {this.state.title_image ? (
                          <img
                            src={this.state.title_image.secure_url}
                            alt=""
                            width="120px"
                            className="img-responsive img-thumbnail i-bot"
                          />
                        ) : null}
                      </div>
                    </div>
                    <br />
                    {/*    <Field component={ImageCropper} name="title_image" />
                                <Field component={ImageCropper} name="featured_image" /> */}
                    <div className="row">
                      <div className="col-sm-6">
                        <Field
                          name="order"
                          icon="fa fa-info-circle"
                          tooltip={infoOf.order}
                          fieldName="Order"
                          type="number"
                          component={RenderFiled}
                          validate={[required]}
                        />
                      </div>
                      <div className="col-sm-6">
                        <Field
                          name="status"
                          options={STATUS}
                          label="Status"
                          defaultValue={
                            this.state.status ? "Active" : "In-Active"
                          }
                          textField="title"
                          valueField="value"
                          component={DropdownComp}
                        />
                      </div>
                    </div>
                    <br />
                    {/*    <Field name="order" icon='fa fa-info-circle' tooltip={infoOf.order} fieldName="Order" type="number" component={RenderFiled} />   */}
                    <div className="form-actions">
                      <button
                        type="submit"
                        className="btn green uppercase"
                        disabled={this.props.invalid || this.props.submitting}
                      >
                        {formAction === "ADD" ? "Add " : "Edit"}
                      </button>
                    </div>
                  </form>
                </Tab>
                <Tab eventKey={2} title="Revisions">
                  <Revisions revisions={this.state.revisions} />
                </Tab>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    );
  }

  upsertCMS(data) {
    const { match } = this.props;
    this.setState({ isLoading: true });
    /*bind type of Post*/
    data.type = "social";
    if (match.params._id) data.editID = match.params._id;
    let formData = new FormData();
    /*add file to request*/
    formData.append("image", data.image);
    formData.append("title_image", data.title_image);
    formData.append("featured_image", data.featured_image);
    formData.append("body_image", data.body_image);

    /*  formData.append("title_image", data.title_image);
        formData.append("featured_image", data.featured_image); */
    console.log(data);

    /*   if (data.address) data.address = {address:data.address} */
    formData.append("data", JSON.stringify(data));
    HTTP.Request("post", window.admin.socicalUpdateAdd, formData)
      .then(r => {
        this.props.dispatch(push("/social"));
        toast.success(r.message);
        this.setState({ isLoading: false });
        this.props.dispatch({
          type: ADMIN_TRACK_AUDIT_LOGS,
          action: {
            comment: "Modified the content of Social Link - " + r.data.title,
            type: "audit"
          }
        });
      })
      .catch(e => {
        if (e.errors) {
          this.setState({ isLoading: false });
          e.errors.map(error => toast(error, { type: "error" }));
        }
      });
  }

  getaCMS() {
    const { match, initialize } = this.props;
    /*extract plant id from request*/
    let cmsID = match.params._id ? match.params._id : null;

    if (cmsID) {
      this.setState({ isLoading: true, formAction: "EDIT" });
      HTTP.Request("get", window.admin.getaCMS, { _id: cmsID }).then(result => {
        this.setState({
          isLoading: false,
          status: result.data.data.status,
          image: result.data.data.image ? result.data.data.image : "",
          title_image: result.data.data.title_image
            ? result.data.data.title_image
            : "",
          featured_image: result.data.data.featured_image
            ? result.data.data.featured_image
            : "",
          body_image: result.data.data.body_image
            ? result.data.data.body_image
            : "",
          revisions: result.data.revisions ? result.data.revisions : []
        });
        /*set data to form*/
        initialize(result.data.data);
      });
    }
  }
}

//decorate form component
let upsertSocail_Form = reduxForm({
  form: "socail_Form",
  validate: values => {
    const errors = {};
    if (values.section_one && values.section_two) {
      const secOne = values.section_one.length;
      const secTwo = values.section_two.length;
      if (secTwo > secOne) {
        errors.section_two = "Characters Must be less than Section One Text";
      }
    }
    return errors;
  }
})(UpsertSocial);

export default upsertSocail_Form;
