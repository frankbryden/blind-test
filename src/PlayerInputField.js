import React from 'react';

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
                <input type="text" disabled={this.props.saved} value={this.props.value} onChange={this.handleChange} />
                <button onClick={this.handleSaveBtnClick}>{this.props.saved ? 'Edit' : 'Save'}</button>
                <button onClick={this.handleRemoveBtnClick}>Remove</button>
            </>
        )
    }
}

export default PlayerInputField;