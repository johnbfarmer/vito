import React from 'react';

export default class ChartMetricSelect extends React.Component {
    constructor(props) {
        super(props)

        this.metricSelect = this.metricSelect.bind(this)
        this.addToSelection = this.addToSelection.bind(this)
    }

    metricSelect(e) {
        this.props.common.updateSelectedChartMetrics(e.target.dataset.metric, true)
    }

    addToSelection(e) {
        this.props.common.updateSelectedChartMetrics(e.target.dataset.metric)
    }

    render() {
        var metrics = this.props.common.availableChartMetrics.map((metric, idx) => {
            var isSelected = this.props.common.selectedChartMetrics.indexOf(metric) >= 0;
            return <ChartMetricSelectItem 
                    metric={metric}
                    key={'m_' + idx}
                    metrics={this.props.common.metricLabels}
                    selected={isSelected}
                    metricSelect={this.metricSelect}
                    metricSelectAdd={this.addToSelection}
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
            <div className={cls} data-metric={this.props.metric} onClick={this.props.metricSelectAdd} onDoubleClick={this.props.metricSelect}>
                {this.props.metrics[this.props.metric]}
            </div>
        );
    }
}
