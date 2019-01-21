import React, { Component } from 'react';
/* import Banner from  './404Banner';*/
import Content from  './404Content'; 
import './404.css';
import {MetaTitle} from '../common/MetaTitle';

class NotFound extends Component {
  	render() {
    	return (
			<div className="App">
			{/* 	<Banner /> */}
				<MetaTitle location={ {pathname:'/Page not found'} }/>
			<Content />
			</div>
    	);
  	}
}

export default NotFound;