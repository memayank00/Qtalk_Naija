import React, { Component } from 'react';
import { connect } from 'react-redux';
import {toast} from "react-toastify";
import { Nav, NavItem, NavLink } from 'reactstrap';
import LogoImg from '../../../assets/images/logo-home.png';
import Loginpopup from "../Login/Login";
import SignUppopup from "../SignUp/SignUp";
import {Link} from 'react-router-dom';
import {MetaTitle} from '../MetaTitle';

/**Components */

/**services */
import './header.css';
import { POPUP } from "../actions";
/**CSS */
//import ErrorBoundry from "../common/errorBoundry";


class Header extends Component {
  constructor(props){
    super(props);
    /**event binding  */
    this.openPopup = this.openPopup.bind(this);
  }

  render() {
    const {match,history:{location}} = this.props;

    //if(location.pathname === "/") return (null);
    
    
    return (
      <div className="App">
       <MetaTitle location={location}/>
        <header className="headerBg">
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-sm-12">
                <div className="logoBx">
                <Link to={""}>
                <img src={LogoImg} alt="Logo" />
                </Link>
                  {/* <a href=""><img src={LogoImg} alt="Logo" /></a> */}
                </div>
              </div>
              <div className="col-md-9 col-sm-12">
                <div className="headNavOuter row">
                  <div className="col-md-5 col-sm-6 col-xs-6">
                    {/* <Nav>
                      <NavItem>
                        <NavLink href="#">Home</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="#">Faq</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="#">Blog</NavLink>
                      </NavItem>
                    </Nav> */}
                    </div>
                    <div className="navright col-md-7 col-sm-6 col-xs-6">
                      <button onClick={()=>this.openPopup('login')}>Sign In</button>
                      <button onClick={()=>this.openPopup('signup')}>Create Account</button>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <Loginpopup/>
          <SignUppopup/>
        </header>
      </div>
    );
  }


openPopup(value){
  this.props.dispatch({type:POPUP,data:value})
}

}

export default connect()(Header);
