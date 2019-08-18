import React from 'react';

export default class AggNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {units: 6}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            units: nextProps.numberOfDateUnits
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
        let unitChoicesByAgg = this.getNumUnitsOptions(this.props.common.agg)
        let unitChoices = unitChoicesByAgg.map((v) => {
            return (
                <option value={v} key={"opt_" + v}>{v}</option>
            )
        })
        return (
            <div className='top-border'>
                <div onClick={this.props.common.updateAgg} className='pointer' data-agg='months'>
                    by month
                </div>
                <div onClick={this.props.common.updateAgg} className='pointer' data-agg='weeks'>
                    by week
                </div>
                <div onClick={this.props.common.updateAgg} className='pointer' data-agg='days'>
                    by day
                </div>
                <div className="no-wrap">
                    Show
                    <select
                        onChange={(e) => {
                            var n = e.target.value
                            this.setState({units: n})
                            this.props.common.updateAggUnits(n)
                        }}
                        value={this.props.numberOfDateUnits}
                    >
                        {unitChoices}
                    </select>
                    {this.props.common.agg}
                </div>
                
            </div>
        );
    }
}
