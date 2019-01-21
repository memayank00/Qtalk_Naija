// import Loading from '../components/Common/Loading';

import React from 'react';
import Loadable from 'react-loadable';
export default function LoadableWrapper(opts) {
  	return Loadable(Object.assign({
    	loading: Loading,
    	timeout: 1000 // 1 second
  	}, opts));
};

function Loading() {
    return <div>Loading...</div>;
  }