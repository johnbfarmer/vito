import React from 'react';

const ignoreCols = [
    'id',
    'date',
    'iso_date',
];

const maxMetrics = 4;

export default class ChartMetricSelect extends React.Component {
    constructor(props) {
        super(props)

        this.singleMetricSelect = this.singleMetricSelect.bind(this)
        this.addToSelection = this.addToSelection.bind(this)

        this.state = {
            selectedMetrics: this.props.selectedMetrics
        }
    }

    singleMetricSelect(e) {
        let metric = e.target.dataset.metric
        this.setState({ selectedMetrics: [] }, () => this.addToSelection(null, metric) )
    }

    addToSelection(e, m) {
        let metrics = this.state.selectedMetrics
        let metric = m || e.target.dataset.metric
        let pos = metrics.indexOf(metric);
        if (pos >= 0) {
            metrics.splice(pos, 1);
        } else {
            metrics.push(metric);
        }

        if (metrics.length > maxMetrics) {
            metrics.shift();
        }

        this.props.updateState({ selectedMetrics: metrics, refreshChart: true })
    }

    render() {
        var metrics = this.props.columns.map((col, idx) => {
            let metric = col.uid
            if (ignoreCols.indexOf(metric) >= 0) {
                return
            }
            let label = col.label
            var isSelected = this.state.selectedMetrics.indexOf(metric) >= 0;
            return <ChartMetricSelectItem 
                    metric={metric}
                    key={'m_' + idx}
                    label={ label }
                    selected={isSelected}
                    singleMetricSelect={this.singleMetricSelect}
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

const ChartMetricSelectItem = (props) => {
    var cls = props.selected ? 'hot pointer' : 'pointer';
    return (
        <div className={cls} data-metric={props.metric} onClick={props.metricSelectAdd} onDoubleClick={props.singleMetricSelect}>
            {props.label}
        </div>
    );
}
