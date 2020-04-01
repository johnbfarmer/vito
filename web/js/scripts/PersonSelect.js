import React from 'react';

const people = [{ id:1, name: 'John'},{ id:2, name: 'Ian'},{ id:3, name: 'Pily' },{ id:4, name: 'Choco'  }];

export default class PersonSelect extends React.Component {
    updatePerson(e) {
        var dataset = e.target.dataset;
        var id = dataset.id;
        this.props.updateState({ personId: id  })
      }

    render() {
        var list = people.map((item, idx) => {
            var cls = item.id == this.props.personId ? 'hot pointer' : 'pointer';
            return (<div className={ cls } key={ item.id } data-id={ item.id } onClick={ this.updatePerson }>{ item.name }</div>);
        });

        return (
            <div className='top-border'>
                { list }
            </div>
        );
    }
}
