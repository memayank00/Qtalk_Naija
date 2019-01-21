import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

/** user will redirect on specified route if the user is NOT LOGGED IN 
 * and trying to access Private route 
 * otherwise on the requested Route*/
const PrivateRoute = ({ component: Component, ...rest }) => 
{	
	const {isUserLoggedIn} = rest;
	return(
	  <Route {...rest} render={props => (
	    (isUserLoggedIn) ? (
	      <Component {...props} />
	    ) : (
	      <Redirect to={{
					/**specify the route on which you want to redirect in case of not logged in */
	        pathname: '/',
	        state: { from: props.location }
	      }}/>
	    )
	  )}/>
	);
}

function mapStatesToProps(state){
	return({
		isUserLoggedIn: (state.user && state.user.token) ? true : false   
	});
}


export default connect(mapStatesToProps)(PrivateRoute);