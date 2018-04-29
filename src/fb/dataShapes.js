import PT from 'prop-types';
import firebase from 'firebase';


const Sensor = {
  uid: PT.string.isRequired,
  kind: PT.string.isRequired,
  series: PT.string.isRequired,
  displayName: PT.string,
};

const TemperatureReading = {
  src: PT.string.isRequired,
  ts: PT.oneOfType([PT.instanceOf(Date), PT.instanceOf(firebase.firestore.Timestamp), PT.number]).isRequired,
  series: PT.string.isRequired,
  degc: PT.number.isRequired,
  degf: PT.number.isRequired,
};


const Archive = {
  uid: PT.string,
  src: PT.string.isRequired,
  kind: PT.string.isRequired,
  series: PT.string.isRequired,
  label: PT.string,
  note: PT.string,
  created: PT.instanceOf(firebase.firestore.Timestamp),
  creator: PT.string,
  deleteFlag: PT.oneOf([0, 1, 2]),
};

export {
  Archive,
  Sensor,
  TemperatureReading,
}