import React from 'react'
/** Tool for logging */
// import DevTools from './DevTools';
/** Importing Provider */
import { Provider } from 'react-redux'
/** Importing routes */
import AppRoutes from '../router';

const Root = ({ store, history}) => (
    <Provider store={store}>
        <div>
            <AppRoutes history={history}/>
            {/* <DevTools /> */}
        </div>
    </Provider>
);

export default Root;