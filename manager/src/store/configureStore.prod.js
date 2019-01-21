import createHistory from "history/createBrowserHistory";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "react-router-redux";
import { createStore, applyMiddleware } from "redux";

import { smoothScroll } from "../services/smoothScroll";
/*importing reducers*/
import { reducers } from "../reducers";
/*import Sagas*/
import sagas from "../sagas";

const history = createHistory({basename:"/manager"});
// const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

let middleware = applyMiddleware(routerMiddleware(history), sagaMiddleware);

/**to scroll page on route change */
history.listen(() => {
	smoothScroll.scrollTo("root");
});

/*dispatch action first to Saga then reducer*/

const store = createStore(reducers, middleware);

sagaMiddleware.run(sagas);

export { store, history };
