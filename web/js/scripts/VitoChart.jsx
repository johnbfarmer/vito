import React from 'react';
var ReactHighcharts = require('react-highcharts');
import ChartMetricSelect from './ChartMetricSelect.jsx';

export default class VitoChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMetrics: ['distance_run'],
            config: {
                title: {
                    text: 'VitoStats'
                },
                series: [{
                    name: '',
                    data: [],
                }],
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%b %Y',
                        year: '%Y'
                    },
                },
            }
        }

        this.metrics = [];

        this.metricSelect = this.metricSelect.bind(this);
    }

    updateConfig() {
        if (!('table' in this.props.data)) {
            return;
        }

        var yVal = 0.0;
        var xVal = 0;
        var dt = 0;
        var y = 0;
        var m = 0;
        var d = 0;
        var config = this.defaultConfig();
        this.metrics = [];
        config.series = [{
            name: this.props.common.chartMetrics[this.state.selectedMetrics[0]],
            data: [],
        }];
        if (this.state.selectedMetrics[0] === 'bp') {
            config.series[0].name = 'systolic';
            config.series.push({
                name: 'diastolic',
                data: [],
            });
        }
        this.props.data.table.rows.forEach((v,k) => {
            if (this.metrics.length < 1) {
                for (var i in v) {
                    if (i in this.props.common.chartMetrics) {
                        this.metrics.push(i);
                    }
                }
            }
            dt = v.iso_date;
            y = dt.substr(0,4);
            m = parseInt(dt.substr(5,2)) - 1;
            d = parseInt(dt.substr(8,2)) - 1;
            xVal = Date.UTC(y, m, d);
            this.state.selectedMetrics.forEach((metricName, metricKey) => {
                if (metricName === 'bp') {
                    if (v[metricName]) {
                        var vals = v[metricName].split('/');
                        config.series[0].data.unshift([xVal, parseInt(vals[0])]); // how to do properly?
                        config.series[1].data.unshift([xVal, parseInt(vals[1])]);
                    }
                } else {
                    yVal = parseFloat(v[metricName]);
                    config.series[metricKey].data.unshift([xVal, yVal]);
                }
            });
        });

        this.state.config = config;
    }

    metricSelect(e) {
        var dataset = e.target.dataset;
        var metric = dataset.metric;
        this.setState({selectedMetrics: [metric]});
    }

    defaultConfig() {
        return {
                title: {
                    text: 'VitoStats'
                },
                series: [{
                    name: '',
                    data: [],
                }],
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%b %Y',
                        year: '%Y'
                    },
                },
            };
    }

    render() {
        this.updateConfig();
        return (
            <div>
                <div id="vito-metric-select">
                    <ChartMetricSelect selectedMetrics={this.state.selectedMetrics} metrics={this.metrics} common={this.props.common} metricSelect={this.metricSelect} />
                </div>
                <div id="vito-chart">
                    <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>;
                </div>
            </div>
        );
    }
}
