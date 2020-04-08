import React from 'react';

const AggNav = (props) => {
    let aggOptions = [
        'months', 'weeks', 'days'
    ];
    let aggChoices = aggOptions.map((v) => {
        return (
            <option value={v} key={"opt_" + v}>{v}</option>
        )
    })

    return (
        <div className='top-border'>
            <div>
                <input
                    onChange={(e) => {
                        var n = Number(e.target.value);
                        props.updateState({ units: n, makeApiCall: false });
                    }}
                    onBlur={(e) => {
                        props.updateState({ units: e.target.value, makeApiCall: true, dateStart: null, dateEnd: null })
                    }}
                    value={props.units}
                />
                <select
                    onChange={(e) => {
                        var n = e.target.value
                        props.updateState({ agg: n, makeApiCall: true, dateStart: null, dateEnd: null })
                    }}
                    value={props.agg}
                >
                    {aggChoices}
                </select>
            </div>
            
        </div>
    );
}

module.exports = AggNav
