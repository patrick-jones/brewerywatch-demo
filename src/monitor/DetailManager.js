import {kea} from 'kea/es/kea/index';
import {Passthrough, SnackbarLogic} from '../common';
import {epoch, ulid, withKey} from '../util';
import PT from 'prop-types';
import {TemperatureReading} from '../fb/dataShapes';
import {call, put} from 'redux-saga/es/internal/io';
import {firebase, firestore} from '../fb';
import {push} from 'react-router-redux';

const DetailManager = kea({
  key: (props) => props.id,
  path: (key) => ['scenes', 'readings', 'sensor', key],

  connect: {
    actions: [
      SnackbarLogic, ['addToast']
    ],
  },

  actions: () => ({
    setTool: activeTool => ({activeTool}),
    // zoom: (start, end) => ({start, end}),
    // unzoom: () => ({start: 'dataMin', end: 'dataMax'}),
    archive: (start, end) => ({start, end}),
    annotate: point => ({point}),

    formLabel: label => ({label}),
    formNote: note => ({note}),
    formClose: () => ({nextState: {label: '', note: ''}}),

    saveArchive: (form, sensor, region) => ({form, sensor, region}),
    saveAnnotation: (form, point) => ({form, point}),

    editAnnotation: point => ({point}),
    deleteAnnotation: point => ({point}),
  }),

  reducers: ({actions, key}) => {
    const keyed = withKey(key);
    return ({
      activeTool: ['none', PT.oneOf(['none', 'archive', 'annotate']), {
        [actions.setTool]: keyed((state, {activeTool}) => activeTool),
        [actions.formClose]: keyed(() => 'none'),
      }],

      // zoomRegion: [['dataMin', 'dataMax'], PT.arrayOf(PT.oneOfType([PT.number, PT.string])), {
      //   [actions.zoom]: keyed((state, {start, end}) => [start, end]),
      //   [actions.unzoom]: keyed((state, {start, end}) => [start, end]),
      // }],

      archiveRegion: [null, PT.arrayOf(PT.number), {
        [actions.archive]: keyed((state, {start, end}) => [start, end]),
        [actions.formClose]: keyed(() => null),
      }],

      annotateAt: [null, PT.shape(TemperatureReading), {
        [actions.annotate]: keyed((state, {point}) => point),
        [actions.formClose]: keyed(() => null),
      }],

      editAt: [null, PT.shape(TemperatureReading), {
        [actions.editAnnotation]: keyed((state, {point}) => point),
        [actions.formClose]: keyed(() => null),
      }],

      form: [{label: '', note: ''}, PT.object, {
        [actions.editAnnotation]: keyed((state, {point}) => ({...state, label: point.annotation})),
        [actions.formLabel]: keyed((state, {label}) => ({...state, label})),
        [actions.formNote]: keyed((state, {note}) => ({...state, note})),
        [actions.formClose]: keyed((state, {nextState}) => nextState),
      }],
    });
  },

  selectors: ({selectors}) => ({
    annotations: [
      () => [(_, props) => props.readings || []],
      (readings) => readings.filter(r => !!r.annotation),
      PT.arrayOf(PT.shape(TemperatureReading)),
    ],
  }),

  takeEvery: ({actions}) => ({
    [actions.saveArchive]: function* ({payload}) {
      const {form, sensor, region} = payload;
      const {tenant, readings, user, dispatch} = this.props;

      console.log(readings, region);

      const [start, end] = region;
      const selected = readings.filter(r => {
        // console.log(start, '<=', r.epoch, '<=', end);
        return start <= r.epoch && r.epoch <= end;
      });
      if (!selected.length) {
        yield put(actions.addToast('No points selected'));
        return;
      }
      try {
        const series = epoch().toFixed();
        const docRef = firestore.collection(`breweries/${tenant}/archives`).doc(ulid());
        const collRef = docRef.collection('readings');
        const batch = firestore.batch();
        batch.set(docRef, {
          src: sensor.uid,
          kind: sensor.kind,
          series: series,
          label: form.label,
          note: form.note,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          creator: user.uid,
          deleteFlag: 0,
        });
        for (const reading of selected) {
          const readRef = collRef.doc(reading.uid);
          // noinspection JSUnusedLocalSymbols
          const {uid: _0, series: _1, ...data} = reading;
          batch.set(readRef, {
            series,
            ...data,
          });
        }
        yield call([batch, batch.commit]);
        yield put(actions.addToast('Save complete', {
          children: 'Go',
          onClick: () => {
            const d = dispatch;
            d(push(`/archive/${docRef.id}`));
          },
        }, {autohide: false}));
      } catch (e) {
        console.log(e);
        yield put(actions.addToast(e.message));
      }
    },

    [actions.saveAnnotation]: function* ({payload}) {
      const {form, point} = payload;
      const {tenant, datumPath} = this.props;
      const docRef = firestore.doc(`${datumPath}/${point.uid}`);
      yield call([docRef, docRef.update], {
        annotation: form.label,
      });
    },

    [actions.deleteAnnotation]: function* ({payload}) {
      const {point} = payload;
      const {tenant} = this.props;
      yield call(console.log, point);
      const docRef = firestore.doc(`breweries/${tenant}/readings/${point.uid}`);
      yield call([docRef, docRef.update], {
        annotation: firebase.firestore.FieldValue.delete(),
      });
    }
  }),

})(Passthrough);

export default DetailManager;