import React from 'react';
import { Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

/**routes which can be accessed by superAdmin Only */
const PermissionRoutes = ({ component: Component, ...rest }) => {
    const {  permission, array } = rest;
    return (
        <Route {...rest} render={props => (
            (array.length && array.indexOf(permission) >= 0) ? (
                <Component {...props} />
            ) : ((!array || !array.length) ? <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}/> : <Redirect to={{
            pathname: '/',
            state: { from: props.location }
          }}/>)
        )} />
    );
}

function mapStatesToProps(state) {
    let permissionsArray = state.admin && state.admin.permissions  ? state.admin.permissions :[]
    return ({
        array: permissionsArray
    });
}


export default connect(mapStatesToProps)(PermissionRoutes);