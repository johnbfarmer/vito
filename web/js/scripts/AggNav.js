import React from 'react';
const moment = require('moment');

const AggNav = (props) => {
    let aggOptions = [
        'years', 'months', 'weeks', 'days'
    ];
    let aggChoices = aggOptions.map((v) => {
        return (
            <option value={v} key={"opt_" + v}>{v}</option>
        )
    })

    let de = ''
    let d = moment(props.dateEnd)
    if (d.isValid()) {
        de = '/' + d.format('YYYYMMDD');
    }
    let link = '/' + props.agg + '/' + props.units + de;
    let today = moment().format('YYYYMMDD');

    return (
        <div className='top-border'>
            <div className='top-border'>
                <div>
                    <input
                        onChange={(e) => {
                            var n = Number(e.target.value);
                            props.updateState({ units: n, makeApiCall: false });
                        }}
                        value={props.units}
                        className='nav-input-sm'
                    />
                    <select
                        onChange={(e) => {
                            var n = e.target.value
                            props.updateState({ agg: n, makeApiCall: false })
                        }}
                        value={props.agg}
                    >
                        {aggChoices}
                    </select>
                </div>
                <div>
                    up to 
                    <input
                        onChange={(e) => {
                            var n = e.target.value;
                            props.updateState({ dateEnd: n, makeApiCall: false });
                        }}
                        value={props.dateEnd}
                        className='nav-input-lg'
                    />

                    <span>
                        <a href={ link } >Go</a>
                    </span>
                </div>
            </div>
        </div>
    );
}

module.exports = AggNav
