import React from 'react';
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
    'height': 'Height',
    'abdominals': 'Abdominals',
    'score': 'Score',
    'systolic': 'Systolic',
    'diastolic': 'Diastolic',
    'bp': 'Blood Pressure',
    'pulse': 'Pulse',
    'za': 'ZA',
    'very_active_minutes': 'VAM',
    'fairly_active_minutes': 'FAM',
    'floors': 'Floors',
    'floors_run': 'Floors Run',
    'distance_biked': 'Distance Biked',
    'minutes_biked': 'Minutes Biked',
    'swim': 'Swim',
};

export default class Summary extends React.Component {
    constructor(props) {
        super(props);

        let units = props.match.params.numUnits || 12;
        let agg = props.match.params.agg || 'months';
        let dateEnd = moment().endOf('month').format('YYYYMMDD');
        if ('endDate' in props.match.params) {
            dateEnd = props.match.params.endDate.replace(/-/g, '')
        }
        let dateStart = null
        let prevLink = null
        let nextLink = null
        let params = {
            agg: agg,
            numUnits: units,
            dateEnd: dateEnd,
        }
        let obj = this.calcUnits(params);
        units = obj.units;
        dateStart = obj.dateStart;
        dateEnd = obj.dateEnd;
        prevLink = obj.prevLink;
        nextLink = obj.nextLink;

        this.state = {
            agg: props.match.params.agg || 'months',
            chartType: props.chartType || '',
            columns: [],
            data: [],
            dateEnd: dateEnd,
            dateRangeId: null,
            dateRangeType: 'ym',
            dateStart: dateStart,
            loading: true,
            makeApiCall: true,
            nextLink: nextLink,
            personId: props.personId || 1,
            prevLink: prevLink,
            refreshChart: true,
            selectedMetrics: props.chartSelectedMetrics || ['distance_run'],
            title: 'Vito Stats',
            total: [],
            units: units,
        };

        this.busy = true;
        this.makeApiCall = true;
        this.handleData = this.handleData.bind(this);
        this.dateCellDisplay = this.dateCellDisplay.bind(this);
        this.dayBoolAggPctCellDisplay = this.dayBoolAggPctCellDisplay.bind(this);
        this.updateState = this.updateState.bind(this);
        this.makeChartApiCall = this.makeChartApiCall.bind(this);
    }

    componentDidMount() {
        this.handleData();
    }

    handleData() {
        if (this.state.refreshChart) {
            this.makeChartApiCall();
        }
        if (!this.state.makeApiCall) {
            return;
        }
        var id = this.state.personId;
        let endDate = this.state.dateEnd !== null ? this.state.dateEnd.replace(/-/g, '') : moment().endOf('month').format('YYYYMMDD');
        let simulatedRouteParams = {
            dateEnd: endDate,
            agg: this.state.agg,
            numUnits: this.state.units,
        }
        let obj = this.calcUnits(simulatedRouteParams);
        this.setState(obj);
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
                this.setState({
                    personId: id,
                    data: data.data.table.rows,
                    columns: data.data. table.columns,
                    total:data.data.table.total,
                    refreshChart: true,
                    dateRangeType: '',
                });
            }
            this.loading(false);
        });
    }

    makeChartApiCall() {
        let qs = 'type=' + this.state.chartType + '&m=' + JSON.stringify(this.state.selectedMetrics);
        let url = '/vito/chart?' + qs;
        getData(url);
    }

    calcUnits(params) {
        let endDate = params.dateEnd
        if (!endDate) {
            switch (params.agg) {
                case 'weeks':
                    endDate = moment().endOf('isoweek').format('YYYYMMDD');
                    break;
                case 'months':
                    endDate = moment().endOf('month').format('YYYYMMDD');
            }
        }
        let prevLink = null;
        let nextLink = null;
        let prevDateEnd = null;
        let nextDateEnd = null;
        let mDateEnd = moment(endDate, 'YYYYMMDD');
        let units = params.numUnits;

        switch(params.agg) {
            case 'days':
                let dateEnd = mDateEnd.format('YYYY-MM-DD');
                let dateStart = mDateEnd.subtract((units - 1), 'days').format('YYYY-MM-DD');
                switch (units) {
                    case '7':
                        prevDateEnd = moment(params.dateEnd, 'YYYYMMDD').subtract(7, 'days').format('YYYYMMDD');
                        nextDateEnd = moment(params.dateEnd, 'YYYYMMDD').add(7, 'days').format('YYYYMMDD');
                        prevLink = '/days/7/' + prevDateEnd;
                        nextLink = '/days/7/' + nextDateEnd;
                        break;
                    case '28':
                    case '29':
                    case '30':
                    case '31':
                        prevDateEnd = moment(params.dateEnd, 'YYYYMM01').subtract(1, 'days');
                        nextDateEnd = moment(params.dateEnd, 'YYYYMM01').add(2, 'months').subtract(1, 'days');
                        prevLink = '/days/' + prevDateEnd.daysInMonth() + '/' + prevDateEnd.format('YYYYMMDD');
                        nextLink = '/days/' + nextDateEnd.daysInMonth() + '/' + nextDateEnd.format('YYYYMMDD');
                        break;
                }
                return { units, dateEnd, dateStart, prevLink, nextLink };

            case 'months':
                dateEnd = mDateEnd.endOf('month').format('YYYY-MM-DD');
                let mDateEndFirstOfMonth = mDateEnd.startOf('month');
                dateStart = mDateEndFirstOfMonth.subtract((units - 1) , 'months').format('YYYY-MM-01');
                prevDateEnd = moment(params.dateEnd, 'YYYYMM01').subtract(units, 'months').endOf('month');
                nextDateEnd = moment(params.dateEnd, 'YYYYMM01').add(units, 'months').endOf('month');
                prevLink = '/months/' + units + '/' + prevDateEnd.format('YYYYMMDD');
                nextLink = '/months/' + units + '/' + nextDateEnd.format('YYYYMMDD');
                return { units, dateEnd, dateStart, prevLink, nextLink };

            case 'weeks':
                mDateEnd.endOf('isoweek');
                dateEnd = mDateEnd.format('YYYY-MM-DD');
                dateStart = moment(dateEnd).subtract(units, 'weeks').startOf('isoweek').format('YYYY-MM-DD');
                prevDateEnd = moment(dateEnd).subtract(units + 1, 'weeks').endOf('isoweek');
                nextDateEnd = moment(dateEnd).add(units, 'weeks');
                prevLink = '/weeks/' + units + '/' + prevDateEnd.format('YYYYMMDD');
                nextLink = '/weeks/' + units + '/' + nextDateEnd.format('YYYYMMDD');
                return { units, dateEnd, dateStart, prevLink, nextLink };

            case 'years':
                dateEnd = mDateEnd.endOf('year').format('YYYY-MM-DD');
                dateStart = mDateEnd.subtract(units - 1, 'years').startOf('year').format('YYYY-MM-DD');
                prevDateEnd = moment(dateEnd).subtract(units, 'years').endOf('year');
                nextDateEnd = moment(dateEnd).add(units, 'years').endOf('year');
                prevLink = '/years/' + units + '/' + prevDateEnd.format('YYYYMMDD');
                nextLink = '/years/' + units + '/' + nextDateEnd.format('YYYYMMDD');
                return { units, dateEnd, dateStart, prevLink, nextLink };
        }
    }

    dayBoolAggPctCellDisplay(vals, rowIdx, colIdx) {
        let display = this.state.agg === 'days' ? (vals.za == 1 ? 'yes' : 'no') : Math.round(vals.za * 100, 2) + '%';
        return (
            <Table.Cell key={'cell_' + rowIdx + '_' + colIdx}>
                { display }
            </Table.Cell>
        )
    }

    pctCellTotalDisplay(val, idx) {
        let display = Math.round(val * 100, 2) + '%';
        return (
            <Table.Cell key={'tot_' + idx} className='green'>
                {display}
            </Table.Cell>
        )
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
                // display = 'Week ' + vals.id.substring(7) + ' of ' + vals.id.substring(3, 7);
                display = moment(vals.iso_date).startOf('isoweek').format('MMM D') + ' - ' + moment(vals.iso_date).endOf('isoweek').format('MMM D, YYYY');
            }
            if (vals.date.length === 4) {
                url = '/months/12/' + vals.date + '1231';
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
            specialCols: { date: this.dateCellDisplay, za: this.dayBoolAggPctCellDisplay },
            specialColsTot: { za: this.pctCellTotalDisplay },
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
