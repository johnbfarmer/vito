import React from 'react';

export default class CommonTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            columns: [],
            total: {},
        }
    }

    componentWillUpdate(nextProps) {
        if ('table' in nextProps.data) {
            this.state.rows = nextProps.data.table.rows;
            this.state.columns = nextProps.data.table.columns;
            this.state.total = nextProps.data.table.total || [];
        }
    }

    render() {
        var tableRows = this.state.rows.map((row, idx) => {
            return <CommonTableRow row={row} key={idx} cols={this.state.columns} rowClick={this.props.rowClick} />
        }, this);
        var total = null
        if (this.state.total.date) {
            total = <CommonTableTotalRow row={this.state.total} key={'23XYM.2'} cols={this.state.columns} />
        }
        
        return (
            <div>
                <table className="table-striped table-bordered summary-table full-width">
                    <thead>
                        <CommonTableHeader data={this.state.columns} />
                    </thead>
                    <tbody>
                        {tableRows}
                        {total}
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

export class CommonTableTotalRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var row = this.props.cols.map((col, idx) => {
            if (col.visible) {
                var ttlVal = this.props.row[col.uid] || ''
                return <td key={idx}>{ttlVal}</td>
            }
            return null;
        }, this);
        var cls = '';
        return (
            <tr className={cls}>
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