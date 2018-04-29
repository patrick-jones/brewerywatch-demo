import React, { PureComponent } from 'react';
import PT from 'prop-types';
import {kea} from 'kea';
import fromPairs from 'lodash/fromPairs';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import equals from 'fast-deep-equal';

import {withKey, without} from '../util';
import {RenderProp} from '../common';
import {firestore} from './firebase';


const FirestoreLogic = kea({
  key: (props) => props.id,
  path: (key) => ['fb', key],

  actions: () => ({
    add: (ids) => ({ids}),
    remove: (ids) => ({ids}),
    setData: (id, val) => ({id, val}),
    setError: (id, error) => ({id, error}),
  }),

  reducers: ({actions, props, key}) => {
    const keyed = withKey(key);
    return ({
      data: [{}, PT.object, {
        [actions.remove]: keyed((state, {ids}) => without(state, ids)),
        [actions.setData]: keyed((state, {id, val}) => ({ ...state, [id]: val })),
      }],
      errors: [{}, PT.object, {
        [actions.remove]: keyed((state, {ids}) => without(state, ids)),
        [actions.setData]: keyed((state, {id}) => omitBy(state, (_, key) => key === id)),
        [actions.setError]: keyed((state, {id, error}) => ({ ...state, [id]: error })),
      }],
      loading: [{}, PT.object, {
        [actions.add]: keyed((state, {ids}) => {
          const pairs = ids.map(id => [id, true]);
          const additions = fromPairs(pairs);
          return {
            ...state,
            ...additions,
          };
        }),
        [actions.setData]: keyed((state, {id}) => ({...state, [id]: false})),
      }],
    })
  },
});


const FirestoreKea = FirestoreLogic(RenderProp);


const docData = (snap, dataCallback) => {
  return dataCallback ? dataCallback(snap.data()) : snap.data();
};

const collData = (snap, dataCallback, collectionCallback) => {
  let docs =  snap.docs.map(snap => ({uid: snap.id, ...snap.data()}));
  if (dataCallback) {
    docs = docs.map(doc => dataCallback(doc));
  }
  return collectionCallback ? collectionCallback(docs) : docs;
};

const query = (firestore, spec) => {
  let qry = firestore.collection(spec.path);

  if (spec.where) {
    const where = Array.isArray(spec.where) ? spec.where : [spec.where];
    where.forEach(w => {
      qry = qry.where(w.field, w.comp, w.value);
    })
  }

  if (spec.orderBy) {
    const orderBy = Array.isArray(spec.orderBy) ? spec.orderBy : [spec.orderBy];
    orderBy.forEach(ob => {
      if (typeof ob === 'string') {
        qry = qry.orderBy(ob);
      } else {
        qry = qry.orderBy(ob.field, (ob.direction || 'asc'));
      }
    });
  }

  if (spec.limit) {
    qry = qry.limit(spec.limit);
  }

  return qry;
};

class FirestoreComponent extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      subs: Object.create(null),
      subscriptions: Object.create(null),
      references: Object.create(null),
    };
  }

  static propTypes = {
    children: PT.func.isRequired,
    subs: PT.object,
  };

  static defaultProps = {
    subs: {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const before = prevState.subs;
    const after = nextProps.subs;

    const {setData, setError, add, remove} = nextProps.actions;

    const removed = omitBy(before, (value, key) => equals(after[key], value));
    const added = omitBy(after, (value, key) => equals(before[key], value));

    if (isEmpty(added) && isEmpty(removed)) {
      // no changes
      return null;
    }

    const addedKeys = Object.keys(added);
    if (addedKeys.length) {
      add(addedKeys);
    }

    const removedKeys = Object.keys(removed);
    const subscriptions = without(prevState.subscriptions, removedKeys);
    const references = without(prevState.references, removedKeys);

    removedKeys.forEach(k => {
      prevState.subscriptions[k]();
    });

    // only remove keys that don't have new, changed keys?
    if (removedKeys.length) {
      remove(removedKeys);
    }

    Object.entries(added).forEach(kv => {
      const [key, spec] = kv;
      const isDoc = typeof spec === 'string';
      const ref = references[key] = isDoc ? firestore.doc(spec) : query(firestore, spec);
      const collect = isDoc ? docData : collData;

      subscriptions[key] = ref.onSnapshot(
        function(snap) {
          setData(key, collect(snap, spec.dataCallback, spec.collectionCallback));
        },
        function(err) {
          setError(key, err);
        }
      );
    });

    return {subs: after, subscriptions, references};
  };

  componentWillUnmount() {
    Object.values(this.state.subscriptions).forEach(unsubscribe => unsubscribe());
  }

  render() {
    const {children, data, errors, loading, dispatch} = this.props;
    const {references} = this.state;
    return children({data, errors, loading, references, dispatch});
  }
}

//export default FirestoreLogic(FirestoreComponent);

export default class Firestore extends PureComponent {

  static propTypes = {
    id: PT.string.isRequired,
    children: PT.func.isRequired,
    subs: PT.object,
  };

  render() {
    const {id, children, subs} = this.props;
    return (
      <FirestoreKea id={id}>
        {({actions, data, errors, loading, dispatch}) => {
          return (
            <FirestoreComponent
              children={children}
              subs={subs}
              actions={actions}
              data={data}
              errors={errors}
              loading={loading}
              dispatch={dispatch}
            />
          );
        }}
      </FirestoreKea>
    );
  }
}

export {
  FirestoreComponent,
  FirestoreLogic,
};
