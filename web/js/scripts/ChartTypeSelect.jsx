import React from 'react';
import { Icon } from 'semantic-ui-react';

export default class ChartTypeSelect extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e) {
        var dataset = e.target.parentElement.dataset;
        this.props.handleSelect(dataset.type)
    }

    render() {
        let lineSelectedClass = this.props.chartType === 'line' ? ' hot' : ''
        let barSelectedClass = this.props.chartType === 'column' ? ' hot' : ''
        let noneSelectedClass = this.props.chartType === '' ? ' hot' : ''
        let cls = 'pointer chart-type-selector'
        return (
            <div>
                <span className={cls + noneSelectedClass} onClick={this.handleClick} data-type="">
                    <Icon link name='minus' />
                </span>
                <span className={cls + lineSelectedClass} onClick={this.handleClick} data-type="line">
                    <Icon link name='chart line' />
                </span>
                <span className={cls + barSelectedClass} onClick={this.handleClick} data-type="column">
                    <Icon link name='chart bar' />
                </span>
            </div>
        );
    }
}