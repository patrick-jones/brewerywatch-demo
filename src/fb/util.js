
export function tsCallback(data) {
  if (data.ts) {
    return {
      ...data,
      ts: new Date(data.ts),
    }
  }
  return data;
}


export function timeStampToEpoch(ts) {
  return ts;
}