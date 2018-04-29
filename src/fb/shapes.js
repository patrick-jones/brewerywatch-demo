import PT from 'prop-types';


const FirebaseError = {
  code: PT.string.isRequired,
  message: PT.string.isRequired,
  name: PT.string.isRequired,
  stack: PT.string,
};

const Subscription = {
  id: PT.string.isRequired,
  path: PT.string.isRequired,
  dataCallback: PT.func,
};


const Where = {
  field: PT.string.isRequired,
  comp: PT.oneOf(['<', '<=', '==', '>=', '>']).isRequired,
  value: PT.any.isRequired,
};


const OrderBy = {
  field: PT.string.isRequired,
  direction: PT.oneOf(['asc', 'desc']),
};


const Collection = {
  path: PT.string.isRequired,
  where: PT.oneOfType([PT.shape(Where), PT.arrayOf(PT.shape(Where))]),
  orderBy: PT.oneOfType([PT.string, PT.shape(OrderBy), PT.arrayOf(PT.oneOfType([PT.string, PT.shape(OrderBy)]))]),
  limit: PT.number,
  dataCallback: PT.func,
  collectionCallback: PT.func,
};

export {
  FirebaseError,
  Subscription,
  Collection,
  Where,
  OrderBy,
};
