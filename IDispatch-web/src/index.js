/** fetching environment */
import './utils/env';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
/**registering Service worker for resource caching */
import registerServiceWorker from './registerServiceWorker';

/** App Root */
import AppRoot from './containers/appRoot';

/** Store */
import appStore from './store/appStore';

/**GLOBAL CSS FILES */

import './assets/css/style.css';
import './assets/css/mixin.css';
import './assets/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/fonts/fonts.css';

const history = createHistory();
const store = appStore(history);

ReactDOM.render(
    <Router>
        <AppRoot store={store} history={history} />        
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();