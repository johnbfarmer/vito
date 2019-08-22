import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import CommonTable from './CommonTable.jsx';
import VitoChart from './VitoChart.jsx';

export default class SummaryTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.common.data,
            agg: 'months',
            dateRangeId: null,
            dateRangeType: 'ym',
        };

        this.busy = true;
        this.makeApiCall = true;
        this.handleData = this.handleData.bind(this);
        this.rowClick = this.rowClick.bind(this);
    }

    componentDidMount() {
        this.handleData();
    }

    componentWillUpdate(props) {
        this.state.data = props.common.data;
        this.state.agg = props.common.agg;
    }

    componentDidUpdate(prevProps, prevState) {
        var change = this.makeApiCall || this.props.common.makeApiCall;
        if (!this.busy && change) {
            this.handleData();
        }
        this.makeApiCall = false;
    }

    handleData() {
        var id = this.props.common.personId || 1;
        this.loading(true);
        var url = 'vito/' + id + '/' + this.state.agg + '/' + this.props.common.numberOfDateUnits;
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
                this.props.common.updateState({personId:id, data: {table:{rows:resp.table.rows, columns:resp.table.columns, total:resp.table.total}}, refreshChart: true});
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
                <VitoChart data={this.props.common.data} common={this.props.common} />
                <CommonTable data={this.props.common.data} rowClick={this.rowClick}/>
            </div>
        );
    }
}
