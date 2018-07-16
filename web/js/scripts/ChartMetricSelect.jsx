import React from 'react';

export default class ChartMetricSelect extends React.Component {
    render() {
        var metrics = this.props.metrics.map((metric, idx) => {
            var isSelected = metric === this.props.selectedMetrics[0];
            return <ChartMetricSelectItem 
                    metric={metric}
                    key={'m_' + idx}
                    metrics={this.props.common.chartMetrics}
                    selected={isSelected}
                    metricSelect={this.props.metricSelect}
                   />
        }, this);
        return (
            <div className='top-border top-margin-30'>
                {metrics}
            </div>
        );
    }
}

export class ChartMetricSelectItem extends React.Component {
    render() {
        var cls = this.props.selected ? 'hot pointer' : 'pointer';
        return (
            <div className={cls} data-metric={this.props.metric} onClick={this.props.metricSelect}>
                {this.props.metrics[this.props.metric]}
            </div>
        );
    }
}
