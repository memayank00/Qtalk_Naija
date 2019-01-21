import React, { Component } from 'react';
import PageHeader from "../common/pageheader";
import { Link } from 'react-router-dom';

/**PAGE LEVEL CSS */
import "../../assets/css/error.css";

class NotFound extends Component {
    render() {
        return (
            <div>
                <PageHeader pageTitle="404" route="404" />
                <div className="row">
                    <div className="col-md-12 page-404">
                        <div className="number font-green"> 404 </div>
                        <div className="details">
                            <h3>Oops! You're lost.</h3>
                            <p> We can not find the page you're looking for.
                                        <br />
                                <Link to="/"> Return home </Link></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;