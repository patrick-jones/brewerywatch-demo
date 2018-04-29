import React, { Component } from 'react';
import PT from 'prop-types';

import {DialogContainer, TextField} from 'react-md';


class TimelineSaveDialog extends Component {

  static propTypes = {
    title: PT.string.isRequired,
    visible: PT.bool.isRequired,
    onClose: PT.func.isRequired,
    onSave: PT.func.isRequired,
    label: PT.string.isRequired,
    note: PT.string.isRequired,
    onLabelChanged: PT.func.isRequired,
    onNoteChanged: PT.func.isRequired,
    showNote: PT.bool.isRequired,
  };

  static defaultProps = {
    title: 'Save...',
    visible: false,
    label: '',
    note: '',
  };


  dlgActions = () => {
    // wandering this
    const handleClose = this.handleClose;
    const handleSave = this.handleSave;
    const disabled = !this.canSave();

    return disabled ? [{
      id: `dialog-cancel--e0610c5c`,
      secondary: true,
      children: 'Cancel',
      onClick: handleClose,
    }, {
      id: `dialog-save--e0610c5c`,
      primary: true,
      children: 'Save',
      onClick: handleSave,
      disabled: true,
    }] : [{
      id: `dialog-cancel--e0610c5c`,
      secondary: true,
      children: 'Cancel',
      onClick: handleClose,
    }, {
      id: `dialog-save--e0610c5c`,
      primary: true,
      children: 'Save',
      onClick: handleSave,
      disabled: false,
    }];
  };

  canSave = () => {
    const {label} = this.props;
    return (label || '').trim()!== '';
  };

  handleClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    const {onClose} = this.props;
    onClose();
  };

  handleSave = (e) => {
    if (e) {
      e.preventDefault();
    }
    const {onSave} = this.props;
    onSave();
  };

  render() {
    const {title, visible, onLabelChanged, onNoteChanged, showNote, label, note} = this.props;
    return (
      <DialogContainer
        id={`save-dialog-e0610c5c`}
        title={title}
        onHide={this.handleClose}
        actions={this.dlgActions()}
        focusOnMount={true}
        containFocus={true}
        contentClassName="md-grid"
        visible={visible}
      >
        <form onSubmit={this.handleSave} className='full-width'>
          <TextField
            id={`form-label-e0610c5c`}
            label='Label'
            value={label}
            onChange={onLabelChanged}
            required={true}
            fullWidth={true}
          />
          {showNote && <TextField
            id={`form-note-e0610c5c`}
            label='Notes (optional)'
            value={note}
            onChange={onNoteChanged}
            rows={4}
            fullWidth={true}
          />}
        </form>
      </DialogContainer>
    );
  }
}

export default TimelineSaveDialog;
