import React, { Component } from 'react';
import Creatable from 'react-select/creatable';

const createOption = (label) => ({ label, value: label });

const SPECIAL_KEYS = [ 'Enter', 'Tab', 'Backspace'];

class SearchFilterInputComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: '',
            value: this.props.value,
        };
        this.allowedCharacters = this.props.allowedCharacters;
    }

    handleChange = (value) => {
        value = value || [];
        this.setState({ value }, () => this.props.onValueUpdated(this.state.value));
    }

    handleInputChange = (input) => {
        this.setState({ input });
    };

    shouldAddCharacter = (key) => {
        if (!this.allowedCharacters || SPECIAL_KEYS.includes(key))
            return true;
        return this.allowedCharacters.includes(key);
    }

    addNewValue = () => {
        const { input } = this.state;
        const value = this.state.value || [];

        if (!input)
            return ;

        if (value.length === 0)
            value.push(createOption(input));
        else {
            let newValue = input;
            const last = value[value.length - 1];

            if (this.props.allowDoubleOptions && last.value.indexOf('-') === -1) {
                newValue = `${last.value}-${input}`;
                value.pop();
            }
            if (!value.find(v => v.value === newValue))
                value.push(createOption(newValue));
        }

        this.setState({ value, input: '' }, () => this.props.onValueUpdated(this.state.value));
    }

    handleKeyDown = (event) => {
        if (!this.shouldAddCharacter(event.key))
            return event.preventDefault();

        if (event.key === 'Enter' || event.key === 'Tab') {
                this.addNewValue();
                event.preventDefault();
        }
    };

    render() {
        const { input, value } = this.state;

        return (
            <Creatable
                isMulti
                isClearable
                menuIsOpen={ false }
                value={ value }
                inputId={this.props.inputId}
                inputValue={ input }
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder={this.props.placeholder}
                components={ { DropdownIndicator: null } } />
        );
    }
}

export default SearchFilterInputComponent;
