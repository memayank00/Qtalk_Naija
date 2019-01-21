import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem,Form} from 'reactstrap';
import { Button} from 'reactstrap';
import { reduxForm, Field,reset } from "redux-form";
import { required, emailValiadte } from "../common/fieldValidations";
import FormField from "../common/renderField";
import HTTP from "../../services/http";
/**services */
import {contactUs} from "../../utils/endpoints";
import { toast } from "react-toastify";
import './Contactus.css';
import GoogleMap from './GoogleMap';

class Contactus extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading:false,
      site:{
        lat: 34.1664094,
        lng: -118.31274730000001,
        address:'712 S Main St.',
        city:'Burbank',
        state: 'CA',
        zip:91506,

      }
    };
    this.submitFrom = this.submitFrom.bind(this);
  }
  
  componentDidMount(){
    window.scroll(0,0)
  }

  render() {
    const { handleSubmit } = this.props;
    const { site } = this.state;
    return (
      <div className="App">
        <div className="aboutBanner">
          <div className="container">
            <div className="aboutBanInn">
              <div className="aboutBanBx">contact us</div>
              <div className="breatcrum_Outer">
                <Breadcrumb tag="nav">
                  <BreadcrumbItem tag="a" href="#">Home</BreadcrumbItem>
                  <BreadcrumbItem tag="a" href="#">Contact us</BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>
        <section className="aboutsection">
          <div className="container">
            <div className="contHd">send a message</div>
            <div className="row">
              <div className="col-md-7">
                <div className="contfrmOuter">
                  <Form onSubmit={handleSubmit(this.submitFrom)}>
                    <Field
                      component={FormField}
                      type="text"
                      name="name"
                      placeholder="Name*"
                      validate={[required]}
                    />
                    <Field
                      component={FormField}
                      type="email"
                      name="email"
                      placeholder="Email*"
                      validate={[required,emailValiadte]}
                    />
                    <Field
                      component={FormField}
                      type="text"
                      name="subject"
                      placeholder="Subject"
                    />
                    <Field
                      component={FormField}
                      type="textarea"
                      name="message"
                      placeholder="Message"
                    />
                    <Button 
                      className="warning"
                      type="submit" 
                      disabled={this.props.invalid || this.props.submitting}
                    >Send Message</Button>
                  </Form>
                </div>
              </div>
              <div className="col-md-5 mapBx">
              <GoogleMap site={site} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  submitFrom(values){
    console.log("values--->",values)
    HTTP.Request("post", contactUs, values)
    .then(response => {
      this.props.reset();
      toast(response.message, { type: "success" });
    })
    .catch(err => {
      console.log("err-->",err)
    });
  
  }

}

let contactUsForm = reduxForm({
  form : 'contactUsForm'
})(Contactus)
export default connect()(contactUsForm);
