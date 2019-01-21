import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => 
{	
	const {isAdminLoggedIn} = rest;
	return(
	  <Route {...rest} render={props => (
	    (isAdminLoggedIn) ? (
	      <Component {...props} />
	    ) : (
	      <Redirect to={{
	        pathname: '/login',
	        state: { from: props.location }
	      }}/>
	    )
	  )}/>
	);
}

function mapStatesToProps(state){
	return({
		isAdminLoggedIn: (state.admin.token) ? true : false
	});
}


export default connect(mapStatesToProps)(PrivateRoute);