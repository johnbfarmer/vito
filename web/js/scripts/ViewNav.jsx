import React from 'react';

export default class ViewNav extends React.Component {
    render() {
        return (
            <div className='top-border'>
                <div onClick={this.props.common.updateView} className='pointer' data-view='edit'>
                    new record
                </div>
                <div onClick={this.props.common.updateView} className='pointer' data-view='recent'>
                    recent
                </div>
                <div onClick={this.props.common.updateView} className='pointer' data-view='summary'>
                    summary
                </div>
            </div>
        );
    }
}
