import React from 'react';
import PersonSelect from './PersonSelect';
import AggNav from './AggNav';
import ChartMetricSelect from './ChartMetricSelect.jsx';
import Navigation from './Navigation';

export default class VitoNav extends React.Component {
    render() {
        var aggNav = this.props.agg ? <AggNav { ...this.props } /> : '';
        var chartNav = this.props.chartType !== '' ? <ChartMetricSelect { ...this.props } /> : '';
        return (
            <div>
                <Navigation { ...this.props } />
                <PersonSelect { ...this.props } />
                {chartNav}
                {aggNav}
            </div>
        );
    }
}
