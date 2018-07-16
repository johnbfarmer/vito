import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import CommonTable from './CommonTable.jsx';

export default class VitoEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            html: '',
            data: {},
            dateEnd: null,
            clientUid: 0,
            agg: 'months',
            dateRangeId: '201801',
            dateRangeType: 'ym',
            personId: props.common.personId || 1,
        };

        this.busy = true;
        this.new = this.props.common.recordId == 0;
        this.makeApiCall = true;
        this.handleData = this.handleData.bind(this);
        this.setFormHtml = this.setFormHtml.bind(this);
        this.getFormMarkup = this.getFormMarkup.bind(this);
    }

    componentDidMount() {
        this.handleData(this.props.common.recordId);
    }

    componentWillUpdate(props) {
        this.state.personId = props.common.personId || 1;
        this.state.agg = props.common.agg;
    }

    componentDidUpdate(prevProps, prevState) {
        var change = this.props.common.recordId != prevProps.common.recordId;
        if (!this.busy && change) {
            console.log('rec ' + this.props.common.recordId);
            this.handleData(this.props.common.recordId);
        }
        this.makeApiCall = false;
    }

    handleData(id) {
        this.loading(true);
        var personId = this.props.common.personId;
        var url = this.new ? '/vito/new/' + personId : '/vito/' + id + '/edit';
        fetch(url)
        .then(resp => {
                return resp.text();
        }).then(resp => {
            // console.log(resp);
            this.setFormHtml(resp);
            // this.loading(false);
            this.props.common.updateState({loading: false, makeApiCall: false, recordId: 0});
        });
    }

    setFormHtml(html) {
        this.setState({html: html});
    }

    loading(busy) {
        this.busy = busy;
        this.props.common.updateLoading(busy);
    }

    getFormMarkup() {
        return {__html: this.state.html};
    }

    render() {
        var formMarkup = this.getFormMarkup();
        return (
            <div className="col-md-11" dangerouslySetInnerHTML={formMarkup} />
        );
    }
}
