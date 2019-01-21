import React, { Component } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import GoogleMap from "./GoogleMap";
import { push } from 'react-router-redux';
/**services */
import HTTP from "../../services/http";
import session from "../../services/session";
/**actions */
import { OtherUserDetailEnd} from "../../utils/endpoints";
/**CSS */
import "./ParticularMap.css";
import ViewIcon from "../../assets/images/view-icon.png";
import RadiusIcon from "../../assets/images/radius-icon.png";
import SearchIcon from "../../assets/images/srch-icon.png";


class ParticularMapLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userLocation:{},
      cordinate:{lat: 28.5776327,lon: 77.34828829999992}
    };
    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    const {match,dispatch}=this.props;
    if(match.params.id){
      this.getUser(match.params.id);
    }else{
      dispatch(push("/Friends"));
    }

  }

  render() {
    const { cordinate,userLocation } = this.state;
    const { match, trackingUser } = this.props;
    return (
      <div className="App">
        <div className="findFrdBg dashboardVisiblity">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <div className="row">
                  <div className="col-md-12 clearfix">
                    <div className="col-md-6 col-xs-6 locationtrack">
                    </div>
                    <div className="col-md-6 col-xs-6 locationtrack2">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="NewCssMapBg">
          {Object.keys(userLocation).length>0 &&<GoogleMap
            cordinate={cordinate}
            user={userLocation}
          />}
        </div>

      </div>
    );
  }

  getUser(_id) {
    const {dispatch,initialize}=this.props;
    HTTP.Request("get",OtherUserDetailEnd,{_id})
    .then((response) =>{
      if(response.type=="success"){
        let {data}=response;
        if(data.length>0 && data[0].cordinate && Array.isArray(data[0].cordinate)){
          let cordinate=data[0].cordinate;
          this.setState({userLocation:data[0]})
          if(cordinate.length>0){
            this.setState({cordinate:cordinate[0]})
          }
        }
        this.setState({array:data});
      }else{
        dispatch(push("/Friends"));
      }
    })
    .catch((error) =>{
      dispatch(push("/Friends"));
    })
  }

}


export default connect()(ParticularMapLocation);
