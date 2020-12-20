import React from 'react';
import { Form, Input, Button, Col, Row } from 'antd';

class PlayerInputField extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSaveBtnClick = this.handleSaveBtnClick.bind(this);
        this.handleRemoveBtnClick = this.handleRemoveBtnClick.bind(this);
    }

    handleChange(e) {
        console.log(e.target.value);
        this.props.handleInputChange(this.props.playerId, e.target.value);
    }

    handleSaveBtnClick() {
        console.log("save/edit");
        this.props.handlePlayerSaveToggle(this.props.playerId);
    }
    
    handleRemoveBtnClick() {
        console.log("remove");
        this.props.handleRemovePlayer(this.props.playerId);
    }

    render() {
        return (
            <>
                <Row>
                    <Col span={12}>
                        <Input type="text" disabled={this.props.saved} value={this.props.value} onChange={this.handleChange} />
                    </Col>
                    <Col span={6}>
                        <Button onClick={this.handleSaveBtnClick}>{this.props.saved ? 'Edit' : 'Save'}</Button>
                        <Button onClick={this.handleRemoveBtnClick}>Remove</Button>  
                    </Col>
                </Row>
                
                
                
            </>
        )
    }
}

export default PlayerInputField;