
function withoutOne(object, key) {
  const reply = {...object};
  delete reply[key];
  return reply;
}

function withoutAny(object, keys) {
  const reply = {...object};
  keys.forEach(key => {
    delete reply[key];
  });
  return reply;
}

export default function without(object, keys) {
  return typeof keys === 'string' ? withoutOne(object, keys) : withoutAny(object, keys);
}
