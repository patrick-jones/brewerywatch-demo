import querystring from 'querystring';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';

// docs: https://nodejs.org/api/querystring.html

function excludeEmptyValues(value) {
  return !(isEmpty(value) && value !== 0);
}

export function parse(queryString) {
  const query = queryString || '';
  const q = query.startsWith('?') ? query.substring(1) : query;
  return querystring.parse(q);
}

export function stringify(obj, options={prepend: '', removeEmpty: false}) {
  const {prepend, removeEmpty} = {
    prepend: '',
    removeEmpty: false,
    ...options,
  };
  const params = removeEmpty ? pickBy(obj, excludeEmptyValues) : obj;
  // Returns an empty string for null, undefined or {}
  const query = querystring.stringify(params);
  if (!!query) {
    return `${prepend}${query}`;
  }
  return query;
}

