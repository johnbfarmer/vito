import React from 'react';
import { Link, Redirect } from 'react-router-dom'

function Navigation (props) {
    return (
        <div>
            <div>
                <Link to="/">Main</Link>
            </div>
        </div>
    );
}

module.exports = Navigation;