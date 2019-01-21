import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

	/** user will redirect on specified route if the user is logged in 
 * and trying to access Without Login route*/
const WithoutLogin = ({ component: Component, ...rest }) => {
	const { isUserLoggedIn } = rest;
	return (
		<Route {...rest} render={props => (

			(isUserLoggedIn) ? (
				<Redirect to={{
					/**specify the route on which user will redirect if the user is logged in 
					 * and trying to access Without Login route*/
					pathname: '/',
					state: { from: props.location }
				}} />
			) : (
					<Component {...props} />
				)
		)} />
	);
}

function mapStatesToProps(state) {
	return ({
		 isUserLoggedIn: (state.user && state.user.token) ? true : false
	});
}


export default connect(mapStatesToProps)(WithoutLogin);