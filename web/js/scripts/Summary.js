import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Grid, Header, Table } from 'semantic-ui-react'
import CommonTable from './CommonTable.jsx';
import VitoChart from './VitoChart.jsx';
import VitoNav from './VitoNav';
import { getData } from './DataManager';
import tableHelper from './TableHelper';

const moment = require('moment');
const maxMetrics = 4;

const metricLabels = {
    'distance': 'Distance',
    'distance_run': 'Distance Run',
    'steps': 'Steps',
    'stepsPerKm': 'Steps/Km',
    'sleep': 'Sleep',
    'weight': 'Weight',
    'abdominals': 'Abdominals',
    'systolic': 'Systolic',
    'diastolic': 'Diastolic',
    'bp': 'Blood Pressure',
    'pulse': 'Pulse',
    'za': 'ZA',
    'very_active_minutes': 'VAM',
    'floors': 'Floors',
    'floors_run': 'Floors Run',
    'distance_biked': 'Distance Biked',
    'minutes_biked': 'Minutes Biked',
    'swim': 'Swim',
};

export default class Summary extends React.Component {
    constructor(props) {
        super(props);

        let units = props.match.params.units || 12
        let dateEnd = null
        if ('unitType' in props.match.params) {
            let obj = this.calcUnits(props.match.params);
            units = obj.units;
            dateEnd = obj.dateEnd;
        }

        this.state = {
            data: [],
            agg: props.match.params.agg || 'months',
            dateRangeId: null,
            dateRangeType: 'ym',
            chartType: '',
            refreshChart: false,
            loading: true,
            personId: 1,
            units: units,
            dateEnd: dateEnd,
            columns: [],
            total: [],
            selectedMetrics: ['distance_run'],
            makeApiCall: true,
        };

        this.busy = true;
        this.makeApiCall = true;
        this.handleData = this.handleData.bind(this);
        this.dateCellDisplay = this.dateCellDisplay.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.handleData();
    }

    handleData() {
        if (!this.state.makeApiCall) {
            return
        }
        var id = this.state.personId || 1;
        this.loading(true);
        var url = '/vito/' + id + '/' + this.state.agg + '/' + this.state.units;
        var qs = '';
        if (this.state.dateEnd !== null) {
            qs = '?dateEnd=' + this.state.dateEnd;
        }
        url = url + qs;
        getData(url)
        .then(data => {
            if (data.data.table.rows.length > 0) {
                this.setState({personId: id, data: data.data.table.rows, columns: data.data. table.columns, total:data.data.table.total, refreshChart: true, dateRangeType: '' });
            }
            this.loading(false);
        });
    }

    calcUnits(routeParams) {
        if (routeParams.unitType === 'month') {
            let days = moment(routeParams.unit, 'YYYYMM').daysInMonth();
            let lastDayOfMonth = moment(routeParams.unit + days, 'YYYYMMDD').format('YYYY-MM-DD');
            let units = days;
            let dateEnd = lastDayOfMonth;
            let today = moment().format('YYYY-MM-DD');
            if (today < lastDayOfMonth) {
                dateEnd = today;
                units = moment().format('D');
            }
            return { units, dateEnd }
        }

        if (routeParams.unitType === 'week') {
            let yr = routeParams.unit.substring(0, 4);
            let wk = routeParams.unit.substring(4);
            let dateEnd = moment(yr).add(wk, 'weeks').endOf('week').format('YYYY-MM-DD');
            let units = 7;
            return { units, dateEnd }
        }
    }

    dateCellDisplay(vals, rowIdx, colIdx) {
        let url = '/vito/' + vals.id + '/edit';
        if (typeof(vals.id) == 'string') {
            if (vals.id.substring(0,3) === 'ym_') {
                url = '/month/' + vals.id.substring(3) + '/days';
            }
            if (vals.id.substring(0,3) === 'yw_') {
                url = '/week/' + vals.id.substring(3) + '/days';
            }
        }
        return (
            <Table.Cell key={'cell_' + rowIdx + '_' + colIdx}>
                <a
                    href={url}
                >
                    {vals.date}
                </a>
            </Table.Cell>
        )
        // if id is dateRangeId_, handle dateRangeId
        // if (typeof(id) === 'string' && id.substring(0,3) === 'ym_') {
        //     this.setState({agg: 'days', dateRangeId: id.substring(3), dateRangeType: 'ym'});
        //     this.makeApiCall = true;
        // } else if (typeof(id) === 'string' && id.substring(0,3) === 'yw_') {
        //     this.setState({agg: 'days', dateRangeId: id.substring(3), dateRangeType: 'yw'});
        //     this.makeApiCall = true;
        // } else {
        //     var id = dataset.id;
        //     window.location = url;
        // }
    }

    loading(loading) {
        this.setState({loading: loading});
    }

    updateState(s) {
        this.setState(s, () => { this.handleData() });
    }

    render() {
        var propsForTable = {
            data: this.state.data,
            columns: this.state.columns,
            total: this.state.total,
            cb: {},
            specialCols: { date: this.dateCellDisplay },
        }
        var tbl = tableHelper.tablify(propsForTable);

        return (
            <div>
                <Grid>
                    <Grid.Column width={3}>
                        <VitoNav { ...this.state } updateState={this.updateState} />
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <VitoChart 
                            { ...this.state }
                             updateState={this.updateState}
                             metricLabels={metricLabels}
                        />
                        {tbl}
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
