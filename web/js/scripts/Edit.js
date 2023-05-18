import React from 'react';
import { Grid, Header, Table } from 'semantic-ui-react'

import VitoChart from './VitoChart';
import VitoNav from './VitoNav';
import { getData } from './DataManager';
import tableHelper from './TableHelper';

const moment = require('moment');

const metricLabels = {
    'abdominals': 'Abdominals',
    'bp': 'Blood Pressure',
    'diastolic': 'Diastolic',
    'distance': 'Distance',
    'distance_biked': 'Distance Biked',
    'distance_run': 'Distance Run',
    'floors': 'Floors',
    'floors_run': 'Floors Run',
    'height': 'Height',
    'pulse': 'Pulse',
    'score': 'Score',
    'sleep': 'Sleep',
    'steps': 'Steps',
    'stepsPerKm': 'Steps/Km',
    'swim': 'Swim',
    'systolic': 'Systolic',
    'very_active_minutes': 'VAM',
    'fairly_active_minutes': 'FAM',
    'weight': 'Weight',
    'za': 'ZA',
};

export default class Edit extends React.Component {
    constructor(props) {
        super(props);
console.log(props)
        this.state = {
        };

        this.busy = true;
        this.makeApiCall = true;
        this.handleData = this.handleData.bind(this);
        this.dateCellDisplay = this.dateCellDisplay.bind(this);
        this.dayBoolAggPctCellDisplay = this.dayBoolAggPctCellDisplay.bind(this);
        this.updateState = this.updateState.bind(this);
        this.makeChartApiCall = this.makeChartApiCall.bind(this);
    }

    loading(loading) {
        this.setState({loading: loading});
    }

    updateState(s) {
        this.setState(s, () => { this.handleData() });
    }

    render() {
        return (
            <div>
                <Grid>
                    <Grid.Column width={3}>
                        <VitoNav { ...this.state } updateState={this.updateState} />
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {this.props}
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
