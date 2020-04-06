import React from 'react';

export default class ChartTypeSelect extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e) {
        var dataset = e.target.dataset;
        this.props.handleSelect(dataset.type)
    }

    render() {
        let lineSelectedClass = this.props.chartType === 'line' ? ' hot' : ''
        let barSelectedClass = this.props.chartType === 'column' ? ' hot' : ''
        let cls = 'pointer chart-type-selector'
        return (
            <div>
                <span className={cls} onClick={this.handleClick} data-type="">none</span>
                <span className={cls + lineSelectedClass} onClick={this.handleClick} data-type="line">line</span>
                <span className={cls + barSelectedClass} onClick={this.handleClick} data-type="column">bar</span>
            </div>
        );
    }
}