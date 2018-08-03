import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import CommonTable from './CommonTable.jsx';
import VitoNav from './VitoNav.jsx';

export default class RecentTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.common.data,
            // personId: props.common.personId,
        };

        this.busy = true;
        this.handleData = this.handleData.bind(this);
    }

    componentDidMount() {
        this.handleData();
    }

    componentWillUpdate(props) {
        this.state.data = props.common.data;
    }

    componentDidUpdate(prevProps) {
        var id = this.props.common.personId;
        var prevId = prevProps.common.personId;
        if (!this.busy && id != prevId) {
            this.handleData();
        }
    }

    handleData() {
        var id = this.props.common.personId;
        this.loading(true);
        fetch('vito/recent/' + id)
            .then(resp => {
                return resp.json();
            })
            .then(resp => {
                if (resp.table.rows.length > 0) {
                    this.props.common.updateState({data: {table:{rows:resp.table.rows, columns:resp.table.columns}}});
                }
                this.loading(false);
            });
    }

    rowClick(e) {
        var dataset = e.target.parentNode.dataset;
        var id = dataset.id;
        // console.log(id);
        // console.log('row clicked ' + id);
        this.props.common.updateRecord();
    }

    loading(busy) {
        this.busy = busy;
        this.props.common.updateLoading(busy);
    }

    render() {
        return (
            <div>
                <CommonTable data={this.state.data} rowClick={this.props.common.updateRecord} />
            </div>
        );
    }
}
