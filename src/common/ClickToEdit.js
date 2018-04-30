import React, { PureComponent } from 'react';
import PT from 'prop-types';
import {withKey} from '../util';
import {kea} from 'kea';

import {TextField} from 'react-md';


import './ClickToEdit.scss';


const ClickToEditLogic = kea({
  key: (props) => props.id,
  path: (key) => ['scenes', 'clickToEdit', key],

  actions: () => ({
    startEditing: (val) => ({val}),
    stopEditing: false,
    setValue: (val) => ({val}),
    setError: (error) => ({error}),
    clearError: true,
  }),

  reducers: ({actions, key}) => {
    const keyed = withKey(key);
    return ({
      fieldValue: ['', PT.string, {
        [actions.setValue]: keyed((state, {val}) => val),
        [actions.startEditing]: keyed((state, {val}) => val),
      }],
      fieldError: [null, PT.string, {
        [actions.setValue]: keyed(() => null),
        [actions.clearError]: keyed(() => null),
        [actions.setError]: keyed((state, {error}) => error),
      }],
      editing: [false, PT.bool, {
        [actions.startEditing]: keyed(() => true),
        [actions.stopEditing]: keyed(() => false),
      }],
    });
  },
});


class ClickToEdit extends PureComponent {

  static propTypes = {
    id: PT.string,
    value: PT.string,
    placeholder: PT.string,
    fullWidth: PT.bool,
    onSave: PT.func.isRequired,
    className: PT.string,
    multiline: PT.bool,
    rows: PT.number,
  };

  static defaultProps = {
    value: '',
    fullWidth: true,
    className: '',
    multiline: false,
  };

  componentDidUpdate(prevProps) {
    if (this._field && this.props.editing && !prevProps.editing) {
      this._field.getField().select();
    }
  }

  handleStartEditing = () => {
    const {value, actions: {startEditing}} = this.props;
    startEditing(value);
  };

  handleSave = () => {
    try {
      this.props.onSave(this.props.fieldValue);
      this.props.actions.stopEditing();
    } catch (x) {
      this.props.actions.setError(x.message || x.toString());
    }
  };

  handleKeyUp = e => {
    switch (e.which) {
      case 13: // enter
        this.handleSave();
        return;
      case 27: // escape
        this.props.actions.stopEditing();
        return;
      default:
        return;
    }
  };

  render() {
    const {id, className} = this.props;
    if (!this.props.editing) {
      return (
        <div
          title='Click to edit'
          onClick={this.handleStartEditing}
          className={'click-to-edit ' + className}
        >
          {this.props.children}
        </div>
      );
    }

    const {placeholder, fieldValue, multiline, rows} = this.props;



    return (
      <div className={className}>
        <TextField
          id={id}
          ref={field => this._field = field}
          placeholder={placeholder}
          value={fieldValue}
          onChange={this.props.actions.setValue}
          onKeyUp={this.handleKeyUp}
          onBlur={this.handleSave}
          rows={multiline ? rows : undefined}
        />
      </div>
    );
  }
}

export default ClickToEditLogic(ClickToEdit);
