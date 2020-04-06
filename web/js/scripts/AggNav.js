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
                        props.updateState({ units: n, makeApiCall: true });
                    }}
                    onBlur={(e) => {
                        props.updateState({ units: e.target.value, makeApiCall: true })
                    }}
                    value={props.units}
                />
                <select
                    onChange={(e) => {
                        var n = e.target.value
                        props.updateState({ agg: n, makeApiCall: true })
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
