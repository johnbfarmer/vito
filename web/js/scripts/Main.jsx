import React from 'react';
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RecentTab from './RecentTab.jsx';
import SummaryTab from './SummaryTab.jsx';
import VitoEdit from './VitoEdit.jsx';
import VitoNav from './VitoNav.jsx';
import Spinner from './Spinner.jsx';
import DialogBox from './DialogBox.jsx';

export default class Vito extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateStart: null,
            dateEnd: null,
            personId: 0,
            recordId: 0,
            people: [{id:1, name: 'John'},{id:2, name: 'Ian'},{id:3, name: 'Pily'}],
            agg: 'months',
            view: 'recent',
            showDialog: false,
            dialogMessage: '',
            dialogTitle: '',
            makeApiCall: true,
            loading: true,
        };

        this.chartMetrics = {
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
            'alcohol': 'Alcohol',
            'tobacco': 'Tobacco',
        };

        this.updatePerson = this.updatePerson.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.updateDateStart = this.updateDateStart.bind(this);
        this.updateAgg = this.updateAgg.bind(this);
        this.updateView = this.updateView.bind(this);
        this.updateLoading = this.updateLoading.bind(this);
        this.getViewTag = this.getViewTag.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    updatePerson(e) {
        var dataset = e.target.dataset;
        var id = dataset.id;
        this.setState({makeApiCall: true, personId: id});
    }

    updateRecord(e) {
        var dataset = e.target.parentNode.dataset;
        var id = dataset.id;
        console.log(id);
        this.setState({makeApiCall: true, view: 'edit', recordId: id});
    }

    updateDateStart(date) {
        var d = typeof date === 'undefined' ? null : date.toISOString().substring(0,10);
        this.setState({makeApiCall: true, dateStart: d});
    }

    updateAgg(e) {
        var dataset = e.target.dataset;
        var agg = dataset.agg;
        this.setState({makeApiCall: true, agg: agg});
    }

    updateView(e) {
        var dataset = e.target.dataset;
        var view = dataset.view;
        this.setState({makeApiCall: true, view: view});
    }

    updateLoading(loading) {
        this.setState({makeApiCall: false, loading: loading});
    }

    updateState(st) {
        this.setState(st);
    }

    common() {
        return {
            personId: this.state.personId,
            recordId: this.state.recordId,
            dateStart: this.state.dateStart,
            people: this.state.people,
            updatePerson: this.updatePerson,
            updateRecord: this.updateRecord,
            updateDateStart: this.updateDateStart,
            agg: this.state.agg,
            updateAgg: this.updateAgg,
            view: this.state.view,
            updateView: this.updateView,
            updateLoading: this.updateLoading,
            useAgg: this.state.view === 'summary',
            makeApiCall: this.state.makeApiCall,
            updateState: this.updateState,
            chartMetrics: this.chartMetrics,
        };
    }

    getViewTag() {
        var common = this.common();
        switch (this.state.view) {
            case 'recent':
                return (
                    <RecentTab 
                        loader={this.setLoader}
                        updatePerson={this.updatePerson}
                        common={common}
                    />
                );
            case 'summary':
                return (
                    <SummaryTab 
                        loader={this.setLoader}
                        updatePerson={this.updatePerson}
                        common={common}
                    />
                );
            default:
                return (
                    <VitoEdit 
                        loader={this.setLoader}
                        updatePerson={this.updatePerson}
                        common={common}
                    />
                );
        }
    }

    closeDialog() {
        this.setState({showDialog: false});
    }

    render() {
        // var elt = document.getElementById('content');
        // var foo = elt.dataset.foo;
        // console.log(foo);
        var common = this.common();
        var viewTag = this.getViewTag();
        return (
            <div>
                <VitoNav common={common} />
                {viewTag}
                <Spinner show={this.state.loading} />
                <DialogBox msg={this.state.dialogMessage} title={this.state.dialogTitle} show={this.state.showDialog} close={this.closeDialog} agree={this.closeDialog}/>
            </div>
        );
    }
}



ReactDOM.render(<Vito />, document.getElementById("content"));