import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';


const WithoutLogin = ({ component: Component, ...rest }) => 
{	
	const {isAdminLoggedIn} = rest;
	return(
	  <Route {...rest} render={props => (
	    (isAdminLoggedIn) ? (
	      <Redirect to={{
	        pathname: '/',
	        state: { from: props.location }
	      }}/>
	    ) : (
	      <Component {...props} />
	    )
	  )}/>
	);
}

function mapStatesToProps(state){
	return({
		// isAdminLoggedIn : (state.admin.token)?true:false
		isAdminLoggedIn: (state.admin.token) ? true : false
	});
}


export default connect(mapStatesToProps)(WithoutLogin);