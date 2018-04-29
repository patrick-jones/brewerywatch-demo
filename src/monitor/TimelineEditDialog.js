import React, { Component } from 'react';
import PT from 'prop-types';

import {DialogContainer, TextField} from 'react-md';

class TimelineEditDialog extends Component {

  static propTypes = {
    title: PT.string.isRequired,
    visible: PT.bool.isRequired,
    onClose: PT.func.isRequired,
    onSave: PT.func.isRequired,
    onDelete: PT.func.isRequired,
    label: PT.string.isRequired,
    note: PT.string.isRequired,
    onLabelChanged: PT.func.isRequired,
    onNoteChanged: PT.func,
    showNote: PT.bool.isRequired,
  };

  static defaultProps = {
    title: 'Edit',
    visible: false,
    label: '',
    note: '',
  };

  constructor(props) {
    super(props);
    this.labelRef = React.createRef();
  }

  dlgActions = () => {
    // wandering this
    const handleClose = this.handleClose;
    const handleDelete = this.handleDelete;
    const handleSave = this.handleSave;
    const disableSave = !this.canSave();
    const disableDelete = !this.canDelete();

    return [{
      id: `dialog-cancel--95ababcb`,
      secondary: true,
      children: 'Cancel',
      onClick: handleClose,
    }, {
      id: `dialog-delete--95ababcb`,
      primary: true,
      children: 'Delete',
      onClick: handleDelete,
      disabled: disableDelete,
    }, {
      id: `dialog-save--95ababcb`,
      primary: true,
      children: 'Save',
      onClick: handleSave,
      disabled: disableSave,
    }];
  };

  handleShow = () => {
    const label = this.labelRef.current;
    if (label) {
      const labelField = label.getField();
      labelField.select();
    }
  };

  canSave = () => {
    const {label} = this.props;
    return (label || '').trim() !== '';
  };

  canDelete = () => {
    const {label} = this.props;
    return (label || '').toUpperCase() === 'DELETE';
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

  handleDelete = (e) => {
    if (e) {
      e.preventDefault();
    }
    const {onDelete} = this.props;
    onDelete();
  };

  render() {
    const {title, visible, onLabelChanged, onNoteChanged, showNote, label, note} = this.props;
    return (
      <DialogContainer
        id={`edit-dialog-95ababcb`}
        title={title}
        onHide={this.handleClose}
        actions={this.dlgActions()}
        focusOnMount={true}
        containFocus={true}
        contentClassName="md-grid"
        visible={visible}
        onShow={this.handleShow}
      >
        <form onSubmit={this.handleSave} className='full-width'>
          <TextField
            id={`form-label-95ababcb`}
            label='Label'
            value={label}
            onChange={onLabelChanged}
            required={true}
            fullWidth={true}
            helpText='To delete this note, type DELETE'
            ref={this.labelRef}
          />
          {showNote && <TextField
            id={`form-note-95ababcb`}
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

export default TimelineEditDialog;
