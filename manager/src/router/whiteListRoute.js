import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const WhiteListRoute = ({ component: Component, ...rest }) => {
    const { isBlackListed } = rest;
    return (
        <Route {...rest} render={props => (
            (isBlackListed === "B") ? (
                <Redirect to={{
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
        isBlackListed: state.admin ? state.admin.blacklistIp:"W"
    });
}

export default connect(mapStatesToProps)(WhiteListRoute);