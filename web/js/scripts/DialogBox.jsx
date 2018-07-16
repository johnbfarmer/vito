import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class DialogBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: false,
            show: false,
        }

        this.close = this.close.bind(this);
        this.agree = this.agree.bind(this);
    }

    componentWillUpdate(props) {
        this.state.msg = props.msg;
        this.state.show = props.show;
    }

    agree() {
        this.state.show=false;
        this.props.agree();
    }

    close() {
        this.state.show=false;
        this.props.close();
    }

    render() {
        return (
                <Modal show={this.state.show} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.state.msg}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Cancel</Button>
                        <Button onClick={this.agree} bsStyle="primary">OK</Button>
                    </Modal.Footer>
                </Modal>
        );
    }
}
