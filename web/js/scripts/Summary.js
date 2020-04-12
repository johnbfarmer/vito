import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Grid, Header, Table } from 'semantic-ui-react'

import VitoChart from './VitoChart';
import VitoNav from './VitoNav';
import { getData } from './DataManager';
import tableHelper from './TableHelper';

const moment = require('moment');

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
        let dateStart = null
        let dateEnd = null
        if ('endDate' in props.match.params) {
            let obj = this.calcUnits(props.match.params);
            units = obj.units;
            dateStart = obj.dateStart;
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
            dateStart: dateStart,
            dateEnd: dateEnd,
            columns: [],
            total: [],
            selectedMetrics: ['distance_run'],
            makeApiCall: true,
            title: 'Vito Stats',
            prevLink: '/months/12/20190401',
            nextLink: null,
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
        if (this.state.dateStart !== null) {
            qs += '?dateStart=' + this.state.dateStart;
        }
        if (this.state.dateEnd !== null) {
            qs += qs === '' ? '?' : '&';
            qs += 'dateEnd=' + this.state.dateEnd;
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
        if (routeParams.agg === 'days') {
            let mDateEnd = moment(routeParams.endDate, 'YYYYMMDD');
            let units = routeParams.numUnits;
            let dateEnd = mDateEnd.format('YYYY-MM-DD');
            let dateStart = mDateEnd.subtract((units - 1), 'days').format('YYYY-MM-DD');
            return { units, dateEnd, dateStart }
        }
        if (routeParams.agg === 'months') {
            let mDateEnd = moment(routeParams.endDate, 'YYYYMMDD');
            let units = routeParams.numUnits;
            let dateEnd = mDateEnd.endOf('month').format('YYYY-MM-DD');
            let mDateEndFirstOfMonth = mDateEnd.startOf('month');
            let dateStart = mDateEndFirstOfMonth.subtract((units - 1) , 'months').format('YYYY-MM-01');
            return { units, dateEnd, dateStart }
        }

        if (routeParams.agg === 'weeks') {
            let yr = routeParams.unit.substring(0, 4);
            let wk = routeParams.unit.substring(4);
            let dateStart = moment(yr).add(wk-1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
            let dateEnd = moment(yr).add(wk-1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');
            let units = 7;
            return { units, dateEnd, dateStart }
        }

        if (routeParams.agg === 'years') {
            let yr = routeParams.unit.substring(0, 4);
            let dateStart = moment(routeParams.unit + '0101', 'YYYYMMDD').format('YYYY-MM-DD');
            let dateEnd = moment(dateStart).endOf('year').format('YYYY-MM-DD');
            let units = 12;
            return { units, dateEnd, dateStart }
        }
    }

    dateCellDisplay(vals, rowIdx, colIdx) {
        let url = '/vito/' + vals.id + '/edit';
        let display = moment(vals.date).format('MMM D, YYYY');
        if (typeof(vals.id) == 'string') {
            if (vals.id.substring(0,3) === 'ym_') {
                let mDateEnd = moment(vals.iso_date).endOf('month');
                let dateEnd = mDateEnd.format('YYYYMMDD');
                let numUnits = mDateEnd.daysInMonth();
                url = '/days/' + numUnits + '/' + dateEnd;
                display = moment(vals.date).format('MMM, YYYY');
            }
            if (vals.id.substring(0,3) === 'yw_') {
                let mDateEnd = moment(vals.iso_date).endOf('isoweek');
                let dateEnd = mDateEnd.format('YYYYMMDD');
                let numUnits = 7;
                url = '/days/' + numUnits + '/' + dateEnd;
                display = 'Week ' + vals.id.substring(7) + ' of ' + vals.id.substring(3, 7);
            }
            if (vals.date.length === 4) {
                url = '/year/' + vals.id + '/months';
                display = vals.id;
            }
        }

        return (
            <Table.Cell key={'cell_' + rowIdx + '_' + colIdx}>
                <a
                    href={url}
                >
                    { display }
                </a>
            </Table.Cell>
        )
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
