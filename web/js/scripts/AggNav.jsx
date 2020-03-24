import React from 'react';

export default class AggNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {units: 6}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            units: nextProps.common.numberOfDateUnits
        })
    }

    getNumUnitsOptions(agg) {
        var numUnits = 36
        switch(agg) {
            case 'days':
                numUnits = 90
                break
            case 'weeks':
                numUnits = 70
                break
            default:
                numUnits = 36
                break
        }

        var foo = new Array(numUnits)

        for (var i = 0; i < foo.length; i++){
            foo[i] = i + 1
        }

        return foo
    }

    render() {
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
                            var n = e.target.value
                            this.setState({units: n})
                        }}
                        onBlur={(e) => {
                            this.props.common.updateAggUnits(this.state.units)
                        }}
                        value={this.state.units}
                    />
                    <select
                        onChange={this.props.common.updateAgg}
                        value={this.props.common.agg}
                    >
                        {aggChoices}
                    </select>
                </div>
                
            </div>
        );
    }
}
