import React, {PureComponent} from 'react';
import PT from 'prop-types';

import {TemperatureReading} from '../fb/dataShapes';

import {mouseMode} from './helpers';
import DetailToolbar from './DetailToolbar';
import RetentionWarning from './RetentionWarning';
import TimelineChart from './TimelineChart';
import TimelineEditDialog from './TimelineEditDialog';
import TimelineSaveDialog from './TimelineSaveDialog';


export default class DetailComponent extends PureComponent {

  static propTypes = {
    units: PT.oneOf(['c', 'f']),
    readings: PT.arrayOf(PT.shape(TemperatureReading)),
    annotations: PT.arrayOf(PT.shape(TemperatureReading)),
    live: PT.bool.isRequired,
    title: PT.string.isRequired,
  };

  static defaultProps = {
    sensor: {},
    readings: [],
    annotations: [],
    units: 'f',
    live: true,
  };

  handleRegionSelect = (start, end) => {
    // empty selection leave as is
    if (start && end) {
      const {actions: {archive}} = this.props;
      archive(start, end);

      // if (activeTool === 'zoom') {
      //   zoom(start, end);
      // } else if (activeTool === 'archive') {
      //   archive(start, end);
      // }
    }
  };

  handleSave = () => {
    const {actions, form, archiveRegion, annotateAt, editAt, sensor} = this.props;

    // They are mutually exclusive
    if (!!archiveRegion) {
      actions.saveArchive(form, sensor, archiveRegion);
    } else if (!!annotateAt) {
      actions.saveAnnotation(form, annotateAt);
    } else if (!!editAt) {
      actions.saveAnnotation(form, editAt);
    }

    actions.formClose();
  };

  handleDelete = () => {
    const {actions, editAt} = this.props;
    if (!!editAt) {
      actions.deleteAnnotation(editAt);
    }

    actions.formClose();
  };

  render() {
    const {
      actions, uid, readings, annotations, units, live, title,
      activeTool, archiveRegion, annotateAt, editAt, form
    } = this.props;

    return (
      <div className="pad-x pad-y rel">
        <DetailToolbar
          title={title}
          activeTool={activeTool}
          setTool={actions.setTool}
        />
        {live ? RetentionWarning({}) : <div/>}
        <TimelineChart
          id={uid}
          readings={readings}
          annotations={annotations}
          units={units}
          mouseMode={mouseMode(activeTool)}
          onRegionSelect={this.handleRegionSelect}
          onPointSelect={actions.annotate}
          onAnnotationClick={actions.editAnnotation}
        />
        <TimelineSaveDialog
          title={archiveRegion ? 'Archive readings' : 'Add marker'}
          visible={!!archiveRegion || !!annotateAt}
          onClose={actions.formClose}
          onSave={this.handleSave}
          onLabelChanged={actions.formLabel}
          onNoteChanged={actions.formNote}
          showNote={!!archiveRegion}
          {...form}
        />
        <TimelineEditDialog
          title="Edit marker"
          visible={!!editAt}
          onClose={actions.formClose}
          onSave={this.handleSave}
          onDelete={this.handleDelete}
          onLabelChanged={actions.formLabel}
          showNote={false}
          {...form}
        />
      </div>
    );
  }
}