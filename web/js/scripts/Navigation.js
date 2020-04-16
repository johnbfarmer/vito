import React from 'react';
import { Link, Redirect } from 'react-router-dom'

function Navigation (props) {
    let linkToday = '/vito/today/' + props.personId
    let linkNew = '/vito/new/' + props.personId

    return (
        <div>
            <div>
                <a href="/">Home</a>
            </div>
            <div>
                <a href={ linkToday }>Today</a>
            </div>
            <div>
                <a href={ linkNew }>New Record</a>
            </div>
        </div>
    );
}

module.exports = Navigation;