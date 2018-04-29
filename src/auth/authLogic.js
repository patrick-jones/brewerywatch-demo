import {kea} from 'kea';
import {call, put} from 'redux-saga/effects';
import PT from 'prop-types';

import {firebase} from '../fb';
import {DefaultFirebaseAuthentication, FirebaseAuthenticationShape} from './shapes';


function noUser(state) {
  return {
    ...DefaultFirebaseAuthentication,
    tenant: state.tenant,
  }
}


export default kea({
  path: () => ['kea', 'authentication'],
  actions: () => ({
    setTenant: (tenant) => ({tenant}),
    setUser: (user) => {
      return user ? ({
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      }) : ({ user: null });
    },
    signIn: (token) => ({token}),
    signInError: (error) => ({error}),
    clearError: true,
    signOut: true,
  }),
  reducers: ({actions}) => ({
    fbAuth: [DefaultFirebaseAuthentication, PT.shape(FirebaseAuthenticationShape), {
      [actions.setTenant]: (state, {tenant}) => ({...state, tenant}),
      [actions.setUser]: (state, {user}) => ({...state, userPending: false, user}),
      [actions.signIn]: (state) => ({...state, error: null}),
      [actions.signInError]: (state, {error}) => ({...state, error}),
      [actions.clearError]: (state) => ({...state, error: null}),
      [actions.signOut]: (state) => (noUser(state)),
    }],
  }),

  takeEvery: ({ actions, workers }) => ({
    // [actions.setUser]: workers.handleUpdateProfile,
    [actions.signIn]: workers.handleSignIn,
    [actions.signOut]: workers.handleSignOut,
  }),

  workers: {
    *handleSignIn(action) {
      const {token} = action.payload;
      try {
        const auth = firebase.auth();
        const user = yield call([auth, auth.signInWithCustomToken], token);
        yield put(this.actions.setUser(user));
      } catch (x) {
        console.debug(x);
        yield put(this.actions.signInError(x.message || 'There was an error signing you in'));
      }
    },
    *handleSignOut() {
      const auth = firebase.auth();
      try {
        yield call([auth, auth.signOut]);
      } catch (x) {
        console.debug(x);
      }
    },
  },

  // takeEvery: ({ actions, workers }) => ({
  //   [actions.setUser]: workers.handleUpdateProfile,
  // }),
  //
  // workers: {
  //   handleUpdateProfile: function* (action) {
  //     const {user} = action.payload;
  //     if (user) {
  //       const {uid, email, emailVerified = false, displayName = '', photoURL = null} = user;
  //       const profile = {
  //         uid,
  //         email,
  //         emailVerified,
  //         displayName,
  //         photoURL,
  //       };
  //       try {
  //         const fb = firebase;
  //         const db = fb.database();
  //         const path = `${reactReduxConfig.userProfile}/${profile.uid}`;
  //         const ref = db.ref(path);
  //         const profileSnap = yield call([ref, ref.once], 'value');
  //         if (profileSnap.exists()) {
  //           yield call([profileSnap.ref, profileSnap.ref.update], profile);
  //         } else {
  //           yield call([profileSnap.ref, profileSnap.ref.set], profile);
  //         }
  //         yield put({type: actionTypes.SET_PROFILE, profile});
  //       } catch (e) {
  //         yield call(console.log, e);
  //       }
  //
  //     }
  //   }
  // },

});
