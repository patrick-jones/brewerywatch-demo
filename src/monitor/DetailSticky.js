import React, { Component } from 'react';
import PT from 'prop-types';

import {TextField} from 'react-md';


class DetailSticky extends Component {

  static propTypes = {
    sticky: PT.string,
    onStickyChanged: PT.func,
    rows: PT.number,
    maxRows: PT.number,
  };

  static defaultProps = {
    sticky: '',
    rows: 6,
    maxRows: 12,
  };


  render() {
    const {sticky, onStickyChanged, rows, maxRows} = this.props;
    return (
      <TextField
        id="vessel-sticky"
        label="Notes"
        rows={rows}
        maxRows={maxRows}
        value={sticky}
        onChange={onStickyChanged}
      />
    );
  }
}

export default DetailSticky;
