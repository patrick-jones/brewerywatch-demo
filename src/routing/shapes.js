import PT from 'prop-types';


const LocationShape = {
  key: PT.string,
  pathname: PT.string.isRequired, // aka path
  search: PT.string, // AKA query string
  hash: PT.string,
  state: PT.object, // arbitrary object added by me
};


const MatchShape = {
  params: PT.object, // key/value pairs from the dynamic segments of the url
  isExact: PT.bool.isRequired,
  path: PT.string.isRequired,
  url: PT.string.isRequired,
};


const HistoryShape = {
  // some props excluded for brevity
  action: PT.oneOf(['PUSH', 'REPLACE', 'POP']).isRequired,
  location: PT.shape(LocationShape).isRequired,
  createHref: PT.func, // creates an href from a location
};


const RoutePropsShape = {
  match: PT.shape(MatchShape),
  location: PT.shape(LocationShape).isRequired,
  history: PT.shape(HistoryShape).isRequired,
};

export {
  HistoryShape,
  LocationShape,
  MatchShape,
  RoutePropsShape,
};
