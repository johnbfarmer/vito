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
        return (
            <div>
                <span className="pointer chart-type-selector" onClick={this.handleClick} data-type="">none</span>
                <span className="pointer chart-type-selector" onClick={this.handleClick} data-type="line">line</span>
                <span className="pointer chart-type-selector" onClick={this.handleClick} data-type="column">bar</span>
            </div>
        );
    }
}