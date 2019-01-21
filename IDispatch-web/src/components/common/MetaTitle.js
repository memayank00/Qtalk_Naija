import React from 'react';
import Helmet from 'react-helmet';
import {decorateTitle} from './helper';

export const MetaTitle = ({location}) => {
	return (
		<Helmet>
            <title>{`${decorateTitle(location.pathname)} | Tracking App`}</title>
            <meta name="description" content="tracking app"/>
        </Helmet>
	)
}