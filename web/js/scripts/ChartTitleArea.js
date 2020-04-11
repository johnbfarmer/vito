import React from 'react';
import { Icon } from 'semantic-ui-react';

const ChartTitleArea = (props) => {
    let isDisabledPrev = props.prevLink === null;
    let isDisabledNext = props.nextLink === null;

    return (
        <div className='title-area'>
            <h3>
                <a href={ props.prevLink }>
                    <Icon link disabled={ isDisabledPrev } name='angle left' />
                </a>
                { props.title }
                <a href={ props.nextLink }>
                    <Icon link disabled={ isDisabledNext } name='angle right' />
                </a>
            </h3>
        </div>
    );
}

module.exports = ChartTitleArea
