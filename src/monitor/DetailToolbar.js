import React, { Component } from 'react';
import PT from 'prop-types';
import {Button, Toolbar} from 'react-md';


class DetailToolbar extends Component {

  static propTypes = {
    title: PT.string.isRequired,
    activeTool: PT.string.isRequired,
    setTool: PT.func.isRequired,
  };

  handleToolClick = (e, tool) => {
    const {activeTool, setTool} = this.props;
    if (activeTool === tool) {
      setTool('none');
    } else {
      setTool(tool);
    }
  };

  handleAnnotationClick = (e) => {
    this.handleToolClick(e, 'annotate');
  };

  handleArchiveClick = (e) => {
    this.handleToolClick(e, 'archive');
  };

  render() {
    const {title, activeTool} = this.props;
    return (
      <Toolbar
        title={title}
        themed
        actions={[
          <Button
            key="annotate"
            tooltipLabel='Add marker'
            icon
            onClick={this.handleAnnotationClick}
            secondary={activeTool === 'annotate'}
          >
            add_circle
          </Button>,
          <Button
            key="archive"
            tooltipLabel='Save to archive'
            icon
            onClick={this.handleArchiveClick}
            secondary={activeTool === 'archive'}
          >
            archive
          </Button>,
        ]}
      />
    );
  }
}

export default DetailToolbar;
