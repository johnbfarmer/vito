import React from 'react';
import { Link, Redirect } from 'react-router-dom'
const moment = require('moment');

function Navigation (props) {
    let linkToday = '/vito/today/' + props.personId
    let linkNew = '/vito/new/' + props.personId
    let today = moment().format('YYYYMMDD');

    return (
        <div>
            <div>
                <a href="/">home</a>
            </div>
            <div>
                <a href={ linkNew }>new record</a>
            </div>
            <div>
                <a href={ linkToday }>today</a>
            </div>
            <div>
                <a href={'/days/10/' + today} >last few days</a>
            </div>
            <div>
                <a href={'/weeks/5/' + today} >last few weeks</a>
            </div>
            <div>
                <a href={'/years/3/' + today} >last few years</a>
            </div>
            <div>
                <a href={'/vids'} >vids</a>
            </div>
        </div>
    );
}

module.exports = Navigation;