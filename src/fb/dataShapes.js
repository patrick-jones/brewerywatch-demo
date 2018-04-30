import PT from 'prop-types';
import firebase from 'firebase';


const Sensor = {
  uid: PT.string.isRequired,
  kind: PT.string.isRequired,
  series: PT.string.isRequired,
  displayName: PT.string,
  sticky: PT.string,
};

const TemperatureReading = {
  src: PT.string.isRequired,
  ts: PT.oneOfType([PT.instanceOf(Date), PT.instanceOf(firebase.firestore.Timestamp), PT.number]).isRequired,
  series: PT.string,
  degc: PT.number,
  degf: PT.number,
};


const Archive = {
  uid: PT.string,
  src: PT.string.isRequired,
  kind: PT.string.isRequired,
  series: PT.string.isRequired,
  sticky: PT.string,
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