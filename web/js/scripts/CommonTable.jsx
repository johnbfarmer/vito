import React from 'react';

export default class CommonTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            columns: []
        }
    }

    componentWillUpdate(props) {
        if ('table' in props.data) {
            this.state.rows = props.data.table.rows;
            this.state.columns = props.data.table.columns;
        }
    }

    render() {
        var tableRows = this.state.rows.map((row, idx) => {
            return <CommonTableRow row={row} key={idx} cols={this.state.columns} rowClick={this.props.rowClick} />
        }, this);
        return (
            <div>
                <table className="table-striped table-bordered summary-table full-width">
                    <thead>
                        <CommonTableHeader data={this.state.columns} />
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }
}

export class CommonTableRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var row = this.props.cols.map((col, idx) => {
            if (col.visible) {
                return <td key={idx}>{this.props.row[col.uid]}</td>
            }
            return null;
        }, this);
        var cls = 'pointer';
        return (
            <tr className={cls} onClick={this.props.rowClick} data-id={this.props.row.id}>
                {row}
            </tr>
        );
    }
}

export class CommonTableHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var headers = this.props.data.map((col, idx) => {
            if (col.visible) {
                return <th key={idx}>{col.label}</th>
            }
            return null;
        }, this);
        return (
            <tr>
                {headers}
            </tr>
        );
    }
}