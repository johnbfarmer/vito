import React from 'react';

export default class PersonSelect extends React.Component {
    render() {
        var people = this.props.common.people.map((item, idx) => {
            var cls = item.id == this.props.common.personId ? 'hot pointer' : 'pointer';
            return (<div className={cls} key={item.id} data-id={item.id} onClick={this.props.common.updatePerson}>{item.name}</div>);
        });
        return (
            <div className='top-border'>
                {people}
            </div>
        );
    }
}
