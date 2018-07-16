import React from 'react';
import PersonSelect from './PersonSelect.jsx';
import AggNav from './AggNav.jsx';
import ViewNav from './ViewNav.jsx';

export default class VitoNav extends React.Component {
    render() {
        var aggNav = this.props.common.useAgg ? <AggNav common={this.props.common} /> : ''
        return (
            <div className="col-md-1">
                <ViewNav common={this.props.common} />
                <PersonSelect common={this.props.common} />
                {aggNav}
            </div>
        );
    }
}
