import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

const CONTRIBUTORS = [
    { github: 'jedwatson', name: 'Jed Watson' },
    { github: 'bruderstein', name: 'Dave Brotherstone' },
    { github: 'jossmac', name: 'Joss Mackison' },
    { github: 'jniechcial', name: 'Jakub Niechciał' },
    { github: 'craigdallimore', name: 'Craig Dallimore' },
    { github: 'julen', name: 'Julen Ruiz Aizpuru' },
    { github: 'dcousens', name: 'Daniel Cousens' },
    { github: 'jgautsch', name: 'Jon Gautsch' },
    { github: 'dmitry-smirnov', name: 'Dmitry Smirnov' },
];
const MAX_CONTRIBUTORS = 6;
const ASYNC_DELAY = 3000;

const Contributors = createClass({
    displayName: 'Contributors',
    propTypes: {
        label: PropTypes.string,
    },
    getInitialState() {
        return {
            value: [CONTRIBUTORS[0]],
        };
    },
    onChange(value) {
        this.setState({
            value: value,
        });
    },
    getOptions(input, callback) {
        input = input.toLowerCase();
        var options = CONTRIBUTORS.filter(i => {
            return i.github.substr(0, input.length) === input;
        });
        var data = {
            options: options,
            complete: true
        };
        setTimeout(function () {
            callback(null, data);
        }, ASYNC_DELAY);
    },
    render() {
        return (
            <div className="section">

                <Select.Async 
                    multi={true} 
                    value={this.state.value} 
                    onChange={this.onChange} 
                    valueKey="github" 
                    labelKey="name" 
                    loadOptions={this.getOptions} />
                
            </div>
        );
    }
});

export default Contributors;