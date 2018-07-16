import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import CommonTable from './CommonTable.jsx';
import VitoChart from './VitoChart.jsx';

export default class SummaryTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            clientUid: 0,
            agg: 'months',
            dateRangeId: '201801',
            dateRangeType: 'ym',
            personId: props.common.personId || 1,
        };

        this.busy = true;
        this.makeApiCall = true;
        this.handleData = this.handleData.bind(this);
        this.rowClick = this.rowClick.bind(this);
    }

    componentDidMount() {
        this.handleData(this.state.personId);
    }

    componentWillUpdate(props) {
        this.state.personId = props.common.personId || 1;
        this.state.agg = props.common.agg;
    }

    componentDidUpdate(prevProps, prevState) {
        var id = this.state.personId;
        var prevId = prevState.personId;
        var agg = this.state.agg;
        var prevAgg = prevState.agg;
        var change = this.makeApiCall || this.props.common.makeApiCall;
        if (!this.busy && change) {
            this.handleData(id);
        }
        this.makeApiCall = false;
    }

    handleData(id) {
        this.loading(true);
        var url = 'vito/' + this.state.agg + '/' + id;
        var qs = '';
        if (this.state.agg === 'days') {
            qs = '?dateRangeId=' + this.state.dateRangeId + '&dateRangeType=' + this.state.dateRangeType;
        }
        if (this.props.common.dateStart !== null && qs.length === 0) {
            qs = qs + '?dateStart=' + this.props.common.dateStart;
        }
        url = url + qs;
        fetch(url)
        .then(resp => {
                return resp.json();
        }).then(resp => {
            if (resp.table.rows.length > 0) {
                this.setState({personId: id, data: {table:{rows:resp.table.rows, columns:resp.table.columns}}});
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

    loading(busy) {
        this.busy = busy;
        this.props.common.updateLoading(busy);
    }

    render() {
        return (
            <div>
                <CommonTable data={this.state.data} rowClick={this.rowClick} />
                <VitoChart data={this.state.data} common={this.props.common} />
            </div>
        );
    }
}
