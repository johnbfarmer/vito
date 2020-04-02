import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Grid } from 'semantic-ui-react'
import CommonTable from './CommonTable.jsx';
import VitoChart from './VitoChart.jsx';
import VitoNav from './VitoNav';
import { getData } from './DataManager';
import tableHelper from './TableHelper';

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            agg: 'months',
            dateRangeId: null,
            dateRangeType: 'ym',
            loading: true,
            personId: 1,
            units: 12,
            columns: [],
            total: [],
        };

        this.busy = true;
        this.makeApiCall = true;
        this.handleData = this.handleData.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.handleData();
    }

    handleData() {
        var id = this.state.personId || 1;
        this.loading(true);
        var url = 'vito/' + id + '/' + this.state.agg + '/' + this.state.units;
        var qs = '';
        if (this.state.agg === 'days' && this.state.dateRangeId) {
            qs = '?dateRangeId=' + this.state.dateRangeId + '&dateRangeType=' + this.state.dateRangeType;
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

    rowClick(e) {
        var dataset = e.target.parentNode.dataset;
        // if id is dateRangeId_, handle dateRangeId
        if (typeof(id) === 'string' && id.substring(0,3) === 'ym_') {
            this.setState({agg: 'days', dateRangeId: id.substring(3), dateRangeType: 'ym'});
            this.makeApiCall = true;
        } else if (typeof(id) === 'string' && id.substring(0,3) === 'yw_') {
            this.setState({agg: 'days', dateRangeId: id.substring(3), dateRangeType: 'yw'});
            this.makeApiCall = true;
        } else {
            var id = dataset.id;
            var url = '/vito/' + id + '/edit';
            window.location = url;
        }
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
            cb: { date: this.rowClick },
            specialCols: {},
        }
        var tbl = tableHelper.tablify(propsForTable);
        return (
            <div>
                <Grid>
                    <Grid.Column width={3}>
                        <VitoNav { ...this.state } updateState={this.updateState} />
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <VitoChart data={this.state.data} common={this.state} />
                        {tbl}
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
