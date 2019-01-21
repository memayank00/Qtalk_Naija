import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ROW extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }

    render() {
        const {element} = this.props;
        return (
            <tr className="odd gradeX" >
                <td> {element.user ? `${element.user.firstname} ${element.user.lastname}` :"Anonymous"} </td>
                <td> {element.user ? element.user.email : "Anonymous"} </td>
                <td> <span className="wordWrap">{element._id.url} </span></td>
                <td> {element.count} </td>
                <td> {element._id.browser} </td>
                <td> {element._id.os}</td>
                <td> {element._id.timezone}</td>
                <td> {element._id.ip}</td>
                <td>                    
                    {element.user && <Link to={`/logs/access/view?userId=${element.user._id}&url=${element._id.url}&browser=${element._id.browser}&os=${element._id.os}&timezone=${element._id.timezone}&ip=${element._id.ip}`} className=" btn btn-xs blue-hoki" ><i className="fa fa-eye"  title="View"></i></Link>}
                </td>
            </tr>
        );
    }
    

}

export default ROW;