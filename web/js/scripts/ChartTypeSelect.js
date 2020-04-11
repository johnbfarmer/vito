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
        let lineSelectedColor = this.props.chartType === 'line' ? 'red' : 'black'
        let barSelectedColor = this.props.chartType === 'column' ? 'red' : 'black'
        let noneSelectedColor = this.props.chartType === '' ? 'red' : 'black'
        let cls = 'pointer chart-type-selector'
        return (
            <div className='chart-type-container'>
                <span className={ cls } onClick={ this.handleClick } data-type="">
                    <Icon link color={ noneSelectedColor } name='minus' />
                </span>
                <span className={ cls } onClick={ this.handleClick } data-type="line">
                    <Icon link color={ lineSelectedColor } name='chart line' />
                </span>
                <span className={ cls } onClick={ this.handleClick } data-type="column">
                    <Icon link color={ barSelectedColor } name='chart bar' />
                </span>
            </div>
        );
    }
}