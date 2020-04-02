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
                        props.updateState({units: n});
                    }}
                    onBlur={(e) => {
                        props.updateState({units: e.target.value})
                    }}
                    value={props.units}
                />
                <select
                    onChange={(e) => {
                        var n = e.target.value
                        props.updateState({agg: n})
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
