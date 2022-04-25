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
