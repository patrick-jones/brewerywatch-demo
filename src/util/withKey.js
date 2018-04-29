

function withKeyInner(key, func) {
  return function(state, payload) {
    return payload.key === key ? func(state, payload) : state;
  }
}


export default function withKey(key) {
  return function(func) {
    return withKeyInner(key, func);
  }
}
