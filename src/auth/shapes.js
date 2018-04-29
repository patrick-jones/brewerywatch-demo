import PT from 'prop-types';

const UserShape = {
  uid: PT.string.isRequired,
  email: PT.string.isRequired,
  emailVerified: PT.bool,
};

const ProfileShape = {
  displayName: PT.string,
  email: PT.string,
  photoURL: PT.string,
};

const FirebaseAuthenticationShape = {
  tenant: PT.string,
  user: PT.shape(UserShape),
  userPending: PT.bool.isRequired,
  error: PT.string,
};


const DefaultFirebaseAuthentication = {
  tenant: null,
  user: null,
  credentials: null,
  userPending: true,
};

export {
  FirebaseAuthenticationShape,
  ProfileShape,
  UserShape,

  DefaultFirebaseAuthentication,
}
