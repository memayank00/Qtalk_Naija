import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { ValidateOnlyAlpha } from "../common/fieldValidations";
/* Component */
import Loader from '../common/loader';
import Socket from '../../socket';
/**services */
import HTTP from "../../services/http";
import session from "../../services/session";
import SearchIcon from "../../assets/images/srch-icon.png";
/**endpoints */
import { sendTrackRequest,getAllTrackUser } from "../../utils/endpoints";
/**actions */
//import { POPUP } from '../common/actions.js';
/**CSS */
import "./Tracks.css";
import ROW from "./row";
import { Z_DATA_ERROR } from "zlib";

//import ErrorBoundry from "../common/errorBoundry";
var timer;
class Tracks extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      array: [],
      activePage: 1,
      searchQuery:'',
      totalItemsCount: 1
    };
    this.friendList = this.friendList.bind(this);
    this.addFrnd = this.addFrnd.bind(this);
    this.search = this.search.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  componentDidMount() {
    this.friendList({page:1});
  }

  

  render() {
    const { match } = this.props;
    const { array,isLoading} = this.state;
    return (
      <div className="App">
        <div className="findFrdBg">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-xs-12 findfrdHd">Tracking</div>
              <div className="col-md-7 col-xs-8 findSrchBx">
                <FormGroup>
                  <Input
                    type="text"
                    name="name"
                    id="search"
                    onChange={this.search}
                    autoComplete="off"
                    placeholder="Search Users"
                  />
                  <Button>
                    <img src={SearchIcon} />
                  </Button>
                </FormGroup>
              </div>
              {/* <div className="col-md-1 col-xs-4 canclbx">
                <a href="">X Cancel</a>
              </div> */}
            </div>
          </div>
        </div>
        <div className="dashBg tracksBx">
          <div className="container">
          {isLoading && <Loader />}
            {array.length>0 ?<div className="row">
              {array.map(list => {
                return (
                  <ROW key={list._id} list={list} sendRequest={this.addFrnd} />
                );
              })}
              <div style={{float:"right",textAlign:"right",display: "inline-block",width: "100%"}}>
                <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.totalItemsCount}
                    pageRangeDisplayed={3}
                    onChange={this.handlePageChange}
                />
               
             </div>
            </div>:(!isLoading && <div className="row">NO DATA</div>)}
          </div>
        </div>
      </div>
    );
  }

  friendList(params = {}) {
    this.setState({ isLoading: true });
      HTTP.Request("get", getAllTrackUser, params)
      .then(response => {
          if(response.type==="success"){
            this.setState({
              isLoading: false,
              totalItemsCount: response.data.total,
              array: response.data ? response.data.users: []
            });
          }else{
            this.setState({
              isLoading: false,
            });
          }
      })
      .catch(err => {
        console.log("err", err);
        this.setState({ isLoading: false });
      });
  }

  addFrnd(data) {
    let obj = {};
    obj.to_userId = data;
    obj.type = "Track";
    const {user} =this.props;
    HTTP.Request("post", sendTrackRequest, obj)
      .then(response => {
        if (response.type === "error") {
          toast(response.errors, { type: "info" });
        } else {
          let socketData={ message:`${user.name} sent you a track request.`,
                           type: 'Track' , to:data}
          Socket.callEvent('request.type',socketData);
          toast(response.message, { type: "success" });
          let page=this.state.activePage;
          this.friendList({page});
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  /**PAGINATION */
  handlePageChange(eventKey) {
    this.setState({ activePage: eventKey });
    this.friendList({
      page: eventKey ? eventKey : 1
    });
    /**to set query in route */
    this.props.history.push({
      search: "?page=" + eventKey
    });
  }

  /**SEARCH */
  search(e) {
    /**to remove Event Pooling  */
    e.persist();
    let seracherror = ValidateOnlyAlpha(e.target.value)
    if (seracherror) {
        this.setState({ seracherror: seracherror });
        return;
    }
    this.setState({ searchQuery: e.target.value, seracherror: seracherror });
    clearTimeout(timer);
    timer = setTimeout(() => {
        this.friendList({
            page:1,
            text: e.target.value ? e.target.value : '',
        });
    }, 1000);
}

}

const mapStatesToProps = state => {
  return {
    user: state.user.user
  };
};

export default connect(mapStatesToProps)(Tracks);
