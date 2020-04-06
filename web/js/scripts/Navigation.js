import React from 'react';
import { Link, Redirect } from 'react-router-dom'

function Navigation (props) {
    return (
        <div>
            <div>
                <a href="/">Summary</a>
            </div>
            <div>
                <a href="/vito/new/1">New Record</a>
            </div>
        </div>
    );
}

module.exports = Navigation;