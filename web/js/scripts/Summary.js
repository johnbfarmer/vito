import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Grid } from 'semantic-ui-react'
import CommonTable from './CommonTable.jsx';
import VitoChart from './VitoChart.jsx';
import VitoNav from './VitoNav';
import dataManager from './DataManager';
import tableHelper from './TableHelper';

export default class SummaryTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            agg: 'months',
            dateRangeId: null,
            dateRangeType: 'ym',
            loading: true,
            personId: 1,
            numberOfDateUnits: 12,
            columns: []
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
        var url = 'vito/' + id + '/' + this.state.agg + '/' + this.state.numberOfDateUnits;
        var qs = '';
        if (this.state.agg === 'days' && this.state.dateRangeId) {
            qs = '?dateRangeId=' + this.state.dateRangeId + '&dateRangeType=' + this.state.dateRangeType;
        }
        url = url + qs;
        fetch(url)
        .then(resp => {
                return resp.json();
        }).then(resp => {
            if (resp.table.rows.length > 0) {
                this.setState({personId: id, data: resp.table.rows, columns: resp. table.columns, total:resp.table.total, refreshChart: true});
            }
            this.loading(false);
        });
    }

    rowClick(e) {
        var dataset = e.target.parentNode.dataset;
        var id = dataset.id;
        var url = '/vito/' + id + '/edit';
        // if id is dateRangeId_, handle dateRangeId
        if (typeof(id) === 'string' && id.substring(0,3) === 'ym_') {
            this.setState({agg: 'days', dateRangeId: id.substring(3), dateRangeType: 'ym'});
            this.makeApiCall = true;
        } else if (typeof(id) === 'string' && id.substring(0,3) === 'yw_') {
            this.setState({agg: 'days', dateRangeId: id.substring(3), dateRangeType: 'yw'});
            this.makeApiCall = true;
        } else {
            window.location = url;
        }
    }

    loading(loading) {
        this.setState({loading: loading});
    }

    updateState(s) {
        this.setState(s);
    }

    render() {
        var propsForTable = {
            data: this.state.data,
            columns: this.state.columns,
            cb: {},
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
