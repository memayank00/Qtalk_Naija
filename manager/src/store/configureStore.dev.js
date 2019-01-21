import createHistory from "history/createBrowserHistory";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "react-router-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";

import { smoothScroll } from "../services/smoothScroll";
/*importing reducers*/
import { reducers } from "../reducers";
/*import Sagas*/
import sagas from "../sagas";

const history = createHistory({basename:"/manager"});
const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
	collapsed: true
});

let middleware = applyMiddleware(
	logger,
	routerMiddleware(history),
	sagaMiddleware
);

if (module.hot) {
	module.hot.accept("../reducers", () => {
		store.replaceReducer(reducers);
	});
}

/**to scroll page on route change */
history.listen(() => {
	smoothScroll.scrollTo("root");
});

/*dispatch action first to Saga then reducer*/

const store = createStore(reducers, middleware);

sagaMiddleware.run(sagas);

export { store, history };
