import React from 'react';
var ReactHighcharts = require('react-highcharts');
import ChartTitleArea from './ChartTitleArea';
import ChartTypeSelect from './ChartTypeSelect';

export default class VitoChart extends React.Component {
    constructor(props) {
        super(props);

        this.handleChartTypeSelection = this.handleChartTypeSelection.bind(this);
        this.updateConfig = this.updateConfig.bind(this);

        this.state = {
            selectedMetrics: ['weight'],
            availableMetrics: ['weight'],
            chartType: props.chartType,
            refreshChart: props.refreshChart,
            config: {},
        }
    }

    componentDidMount() {
        this.updateConfig()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data.length === 0 && this.props.data.length > 0) {
            this.updateConfig();
            return null;
        }

        if (this.props.refreshChart) {
            this.updateConfig();
            return null;
        }
    }

    updateConfig() {
        if (this.props.data.length < 1) {
            return;
        }
        var yVal = 0.0;
        var xVal = 0;
        var dt = 0;
        var y = 0;
        var m = 0;
        var d = 0;
        var config = this.defaultConfig(this.props);
        var metrics = [];
        var selectedMetrics = [];

        this.props.columns.forEach((v,k) => {
            if (v.uid in this.props.metricLabels) {
                metrics.push(v.uid);
            }
        });

        if (metrics.length < 1) {
            return;
        }

        this.props.selectedMetrics.forEach((v,k) => {
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
                    text: this.props.metricLabels[v],
                },
                opposite: k > 0,
            });
        });

        this.props.data.forEach((v,k) => {
            dt = v.iso_date;
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
        this.setState({ refreshChart: false })
        this.props.updateState({refreshChart: false, makeApiCall: false, availableChartMetrics: metrics, selectedChartMetrics: selectedMetrics});
    }

    defaultSeriesObj(uid, yAxisIdx) {
        return {
            name: this.props.metricLabels[uid],
            data: [],
            yAxis: yAxisIdx,
            type: this.props.chartType,
            marker: {
                enabled: false
            },
            uid: uid,
        };
    }

    defaultConfig(props) {
        return {
                title: {
                    text: ''
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
        this.setState({ chartType: chartType })
        this.props.updateState({
            chartType: chartType,
            refreshChart: true
        })
    }

    render() {
        let chart = 
            this.state.chartType !== ''
            ? (
                <div id="vito-chart">
                    <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>;
                </div>
            )
            : ''

        let chartTypeSelect = <ChartTypeSelect chartType={this.state.chartType} handleSelect={this.handleChartTypeSelection} />
        let titleArea = <ChartTitleArea { ...this.props } />

        return (
            <div className="chart-container">
                <div className="chart-top">
                    {titleArea}
                    {chartTypeSelect}
                </div>
                {chart}
            </div>
        );
    }
}
