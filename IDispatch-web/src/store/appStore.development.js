import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import DevTools from '../containers/DevTools';
import rootReducers from '../reducers';
import thunk from 'redux-thunk';
/*import Sagas*/
import sagas from '../sagas';
import logger from 'redux-logger';
//import socket from "../socket/index";





const configureStore = (history) => { 
    
    const sagaMiddleware = createSagaMiddleware();
    let middleware = applyMiddleware(routerMiddleware(history), sagaMiddleware,thunk,logger);

    /** Create store from above params */
    const store = createStore(rootReducers, compose(middleware, DevTools.instrument()));
    /*dispatch action first to Saga then reducer*/
    sagaMiddleware.run(sagas);
    /**return store now */
    return store;
}

export default configureStore