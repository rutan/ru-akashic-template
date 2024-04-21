import { type Eventmitter, eventmit } from 'eventmit';

export interface SplitEventmitter<T> {
  emit: Eventmitter<T>['emit'];
  listener: Omit<Eventmitter<T>, 'emit'>;
}

export function splitEventmit<T>(): SplitEventmitter<T> {
  const { emit, ...listener } = eventmit<T>();
  return { emit, listener };
}
