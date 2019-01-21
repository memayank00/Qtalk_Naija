import React from 'react';
import { Route} from 'react-router-dom';
import { connect } from 'react-redux';

/**routes which can be accessed by superAdmin Only */
const ProfileRoute = ({ component: Component, ...rest }) => {
    const {  permission,array } = rest;

    return (
        <Route {...rest} render={props => (
            (array.indexOf(permission) >= 0) ? (
                <Component {...props} />
            ) : null
        )} />
    );
}

function mapStatesToProps(state) {
    let role={
        title:"ADMIN",
        array:["PROFILE","CHANGEPASSWORD"]
    }

    return ({
        array: role.array
    });
}


export default connect(mapStatesToProps)(ProfileRoute);