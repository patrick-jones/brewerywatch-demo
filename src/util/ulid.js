import {monotonicFactory} from 'ulid';

const ulid_ = monotonicFactory();

export default function ulid() {
  return ulid_().toLowerCase();
}