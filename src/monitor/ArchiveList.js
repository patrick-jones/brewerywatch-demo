import React, { PureComponent, Fragment } from 'react';
import PT from 'prop-types';
import { push } from 'react-router-redux';

import { Link } from 'react-router-dom';
import {
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TablePagination,
} from 'react-md';

import {EmptyState, WholePageBusy} from '../common';

import {Archive} from '../fb/dataShapes';


function formatDate(dt) {
  if (dt) {
    return dt.toDate().toLocaleDateString()
  }
  return '--/--/--';
}


class ArchiveList extends PureComponent {

  static propTypes = {
    archives: PT.arrayOf(PT.shape(Archive)).isRequired,
    loading: PT.bool,
    showDetail: PT.bool,
  };

  static defaultProps = {
    archives: [],
    loading: true,
    showDetail: true,
  };

  handleClick = (archive) => {
    const {dispatch} = this.props;
    console.log(archive);
    dispatch(push(`/archive/${archive.uid}`))
  } ;

  render() {
    const {archives, loading, errors, showDetail} = this.props;
    const empty = !archives.length;
    // if (loading) {
    //   return (
    //     <WholePageBusy />
    //   );
    // }
    return (
      <Fragment>
        <DataTable plain>
          <TableHeader>
            <TableRow>
              <TableColumn>Label</TableColumn>
              {showDetail ? null : <TableColumn grow>Notes</TableColumn>}
              <TableColumn>Created</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archives.map(archive => (
              <TableRow key={archive.uid} onClick={() => this.handleClick(archive)}>
                <TableColumn>{archive.label}</TableColumn>
                {showDetail ? null : <TableColumn>{archive.note}</TableColumn>}
                <TableColumn>{formatDate(archive.created)}</TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
        {
          empty && !loading && !errors.archives &&
          <EmptyState
            title='None yet...'
            message={<Fragment>You can archive sensor readings from <Link to='/readings'>Live Readings</Link></Fragment>}
          />
        }
      </Fragment>
    );
  }
}

export default ArchiveList;
