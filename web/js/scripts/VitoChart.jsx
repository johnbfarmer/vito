import React from 'react';
var ReactHighcharts = require('react-highcharts');
import ChartMetricSelect from './ChartMetricSelect.jsx';

export default class VitoChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMetrics: ['weight'],
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
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('cdu' + this.props.newData);
        // console.log(prevProps.common.makeApiCall, this.props.common.makeApiCall);
        // console.log(prevProps.common.selectedChartMetrics, this.props.common.selectedChartMetrics);
        // console.log(prevProps.data, this.props.data);
        if (prevProps.common.selectedChartMetrics !== this.props.common.selectedChartMetrics) {
            this.updateConfig();
            return null;
        }

        if (!('table' in prevProps.data) && 'table' in this.props.data) {
            this.updateConfig();
            return null;
        }

        if (this.props.newData) {
            this.updateConfig();
            return null;
        }
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
            name: this.props.common.metricLabels[this.state.selectedMetrics[0]],
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
                    if (i in this.props.common.metricLabels) {
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
        this.props.common.updateAvailableChartMetrics(this.metrics);
        this.props.updateNewData(false);
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
        return (
            <div>
                <div id="vito-chart">
                    <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>;
                </div>
            </div>
        );
    }
}
