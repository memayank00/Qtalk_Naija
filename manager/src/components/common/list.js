import React from 'react';

export default class List extends React.Component {
	render(){
		return(
			<span className='label label-info mr-10'>{this.props.permission}</span>
		);
	}
}