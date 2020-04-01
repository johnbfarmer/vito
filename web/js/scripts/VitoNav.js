import React from 'react';
import PersonSelect from './PersonSelect';
import AggNav from './AggNav';
import ChartMetricSelect from './ChartMetricSelect.jsx';
import Navigation from './Navigation';

export default class VitoNav extends React.Component {
    render() {
console.log(this.props)
        var aggNav = this.props.agg ? <AggNav {...this.props} /> : '';
        var chartNav = this.props.showChart ? <ChartMetricSelect {...this.props} /> : '';
        return (
            <div>
                {chartNav}
                <Navigation { ...this.props } />
                <PersonSelect { ...this.props } />
                {aggNav}
            </div>
        );
    }
}
