import React from 'react';
import 'react-day-picker/lib/style.css';

export default class AggNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {units: 6}
    }

    render() {
        let unitChoices = [2,3,4,5,6,7,8,9,10,11,12,18,24,36].map((v) => {
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
                <div className="no-wrap">
                    Show
                    <select
                        onChange={(e) => {
                            var n = e.target.value
                            this.setState({units: n})
                            this.props.common.updateAggUnits(n)
                        }}
                        value={this.state.units}
                    >
                        {unitChoices}
                    </select>
                    {this.props.common.agg}
                </div>
                
            </div>
        );
    }
}
