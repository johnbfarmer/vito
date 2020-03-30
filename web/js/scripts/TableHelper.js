import React from 'react'
import { Header, Table } from 'semantic-ui-react'

const maxLength = 100

const tablify = (props) => {
    var data = props.data;
    var dataFiltered = [];
    var filter = typeof(props.filter) === 'string' ? {any: props.filter} : props.filter
    if ('appFilter' in props && props.appFilter.length > 0) {
        filter.app = props.appFilter
    }
    if ('activeFilter' in props && props.activeFilter.length > 0) {
        filter.active = props.activeFilter
    }

    data.forEach((row) => {
        if (satisfiesFilter(row, filter)) {
            dataFiltered.push(row);
        }
    });
    data = dataFiltered;
    if (data.length === 0) {
        return (
            <Table>
                 <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Header as='h2' textAlign='center'>
                                NO DATA
                            </Header>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
    }

    var columns = props.columns.filter(col => {
        if ('display' in col && col.display === false) {
            return false
        }
        return true
    })

    var cols = columns.map((vals, idx) => {
        return (
            <Table.HeaderCell key={'h_' + vals.uid}>{vals.label}</Table.HeaderCell>
        )
    })

    var rows = data.map((vals, rowIdx) => {
        var id = vals['id'];

        var cells = columns.map((col, colIdx) => {
            if ('specialCols' in props && col.uid in props.specialCols) {
                return props.specialCols[col.uid](vals, rowIdx, colIdx)
            }
            if (!(col.uid in vals)) {
                return null
            }
            let display = vals[col.uid]
            let maximumLen = 'maxLength' in props ? props.maxLength : maxLength
            let cb = 'cb' in props && col.uid in props.cb ? () => {props.cb[col.uid](vals)} : () => {}

            if (display && display.length > maximumLen) {
                display = display.substring(0,97) + '...'
            }

            return (
                <Table.Cell
                    key={'cell_' + rowIdx + '_' + colIdx}
                    onClick={cb}
                >
                    {display}
                </Table.Cell>);
        });

        return (
            <tr 
                key={'r_' + rowIdx}
            >
                {cells}
            </tr>);
    });

    return (
        <Table celled striped>
             <Table.Header>
                <Table.Row>
                    {cols}
                </Table.Row>
             </Table.Header>
            <Table.Body>
                {rows}
            </Table.Body>
        </Table>
    );
}


const satisfiesFilter = (row, filter) => {
    if (!Object.keys(filter).length) {
        return true;
    }

    let filterSatisfied = false

    for (var f in filter) {
        if (f === 'any') {
            if (!filter.any.length) {
                filterSatisfied = true
            } else {
                for(var k in row) {
                    if (row[k].toLowerCase().indexOf(filter.any) > -1) {
                        filterSatisfied = true
                    }
                }
            }
        } else {
            if (f === 'app') {
                if (filterSatisfied && (!filter.app.length || filter[f].indexOf(row[f].toLowerCase()) === -1)) {
                    filterSatisfied = false
                }
            } else {
                if (f === 'active') {
                    if (filterSatisfied && (!filter.active.length || filter[f].indexOf(row.status.toLowerCase()) === -1)) {
                        filterSatisfied = false
                    }
                } else {
                    if (filterSatisfied && row[f].toLowerCase().indexOf(filter[f]) === -1) {
                        filterSatisfied = false
                    }
                }
            }
        }
    }

    return filterSatisfied
}

module.exports = {
    tablify,
    satisfiesFilter,
}