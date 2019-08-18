import React from 'react';
var ReactHighcharts = require('react-highcharts');
import ChartMetricSelect from './ChartMetricSelect.jsx';
import ChartTypeSelect from './ChartTypeSelect.jsx';

export default class VitoChart extends React.Component {
    constructor(props) {
        super(props);
        this.handleChartTypeSelection = this.handleChartTypeSelection.bind(this)
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
    }

    componentDidUpdate(prevProps, prevState) {
        if (!('table' in prevProps.data) && 'table' in this.props.data) {
            this.updateConfig();
            return null;
        }

        if (this.props.common.refreshChart) {
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
        var metrics = [];
        var selectedMetrics = [];

        this.props.data.table.columns.forEach((v,k) => {
            if (v.uid in this.props.common.metricLabels) {
                metrics.push(v.uid);
            }
        });

        if (metrics.length < 1) {
            return;
        }

        this.props.common.selectedChartMetrics.forEach((v,k) => {
            if (metrics.indexOf(v) >= 0) {
                selectedMetrics.push(v);
            }
        });

        if (selectedMetrics.length < 1) {
            selectedMetrics.push(metrics[0]);
        }

        selectedMetrics.forEach((v, k) => {
            if (v === 'bp') {
                v = 'diastolic';
                config.series.push(this.defaultSeriesObj('systolic', k));
            }
            config.series.push(this.defaultSeriesObj(v, k));
            config.yAxis.push({
                title: {
                    text: this.props.common.metricLabels[v],
                },
                opposite: k > 0,
            });
        });

        this.props.data.table.rows.forEach((v,k) => {
            dt = v.iso_date;
console.log(v)
            y = dt.substr(0,4);
            m = parseInt(dt.substr(5,2)) - 1;
            d = parseInt(dt.substr(8,2)) - 1;
            xVal = Date.UTC(y, m, d+1);
            config.series.forEach((seriesObj, seriesKey) => {
                var metricName = seriesObj.name;
                if (metricName === 'Systolic' || metricName === 'Diastolic') {
                    if (v['bp']) {
                        var vals = v['bp'].split('/');
                        var idx = metricName === 'Systolic' ? 0 : 1;
                        yVal = parseInt(vals[idx]);
                    } else {
                        yVal = NaN;
                    }
                } else {
                    yVal = parseFloat(v[seriesObj.uid]);
                }

                config.series[seriesKey].data.unshift([xVal, yVal]);
            });
        });

        this.state.config = config;
        this.props.common.updateState({refreshChart: false, makeApiCall: false, availableChartMetrics: metrics, selectedChartMetrics: selectedMetrics});
    }

    defaultSeriesObj(uid, yAxisIdx) {
        return {
            name: this.props.common.metricLabels[uid],
            data: [],
            yAxis: yAxisIdx,
            type: this.props.common.chartType,
            marker: {
                enabled: false
            },
            uid: uid,
        };
    }

    defaultConfig() {
        return {
                title: {
                    text: 'VitoStats'
                },
                series: [],
                yAxis: [],
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%b %Y',
                        year: '%Y'
                    },
                },
            };
    }

    handleChartTypeSelection(chartType) {
        this.props.common.updateState({
            showChart: chartType !== '',
            chartType: chartType,
            refreshChart: true
        })
    }

    render() {
        console.log(this.state.config.series[0].data)
        let chart = 
            this.props.common.showChart
            ? (
                <div id="vito-chart">
                    <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>;
                </div>
            )
            : ''

        let chartTypeSelect = <ChartTypeSelect chartType={this.props.common.showChart} handleSelect={this.handleChartTypeSelection}/>

        return (
            <div className="chart-container">
                {chartTypeSelect}
                {chart}
            </div>
        );
    }
}
