import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

export default class AggNav extends React.Component {
    render() {
        return (
            <div className='top-border'>
                <div onClick={this.props.common.updateAgg} className='pointer' data-agg='months'>
                    by month
                </div>
                <div onClick={this.props.common.updateAgg} className='pointer' data-agg='weeks'>
                    by week
                </div>
                <DayPickerInput onDayChange={this.props.common.updateDateStart} />
            </div>
        );
    }
}
