/*Importing env vars to application*/
import "./utils/env/env";
/*Importing api urls for application*/
import "./utils/api";
/**Importing services  */

import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";

/*adding css to admin*/
import "./assets/css/index.css";
import "react-widgets/dist/css/react-widgets.css";

// < !--BEGIN GLOBAL MANDATORY STYLES-- >
import "./assets/font-awesome/css/font-awesome.min.css";
import "./assets/simple-line-icons/simple-line-icons.min.css";
import "./assets/bootstrap/css/bootstrap.min.css";
// < !--END GLOBAL MANDATORY STYLES-- >

// < !--BEGIN THEME GLOBAL STYLES-- >
import "./assets/css/components.min.css";
// < !--End THEME GLOBAL STYLES-- >

// < !--BEGIN THEME LAYOUT STYLES-- >
import "./assets/layout/css/layout.min.css";
import "./assets/layout/css/themes/darkblue.min.css";
import "./assets/layout/css/custom.min.css";
// < !--END THEME LAYOUT STYLES-- >

import App from "./components/App";

import registerServiceWorker from "./registerServiceWorker";

import { store, history } from "./store";

ReactDOM.render(
	<Provider store={store}>
		<App history={history} />
	</Provider>,
	document.getElementById("root")
);
registerServiceWorker();
