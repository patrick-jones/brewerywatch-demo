import firebase from 'firebase';
import 'firebase/firestore';


// this is to avoid re-initializing during hot reload
try {
  if (firebase.apps.length === 0) {
    // it feels wrong including this but it is actually the way firebase works
    // https://javebratt.com/hide-firebase-api/
    firebase.initializeApp({
      apiKey: "AIzaSyD3zHF4aUvx-j4OCvlgEd703vGfqPtWqfY",
      authDomain: "brewery-monitor.firebaseapp.com",
      databaseURL: "https://brewery-monitor.firebaseio.com",
      projectId: "brewery-monitor",
      storageBucket: "brewery-monitor.appspot.com",
      messagingSenderId: "872055565276",
    });
  }
} catch (x) {
  if (x.code !== 'app/duplicate-app') {
    throw x;
  }
}


const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true});

export default firebase;

export {
  firestore,
};
