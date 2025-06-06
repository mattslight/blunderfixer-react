export const noop = () => {};

export function on<T extends EventTarget>(
  obj: T | null,
  type: string,
  listener: (e: Event) => void,
  options?: boolean | AddEventListenerOptions
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(type, listener, options);
  }
}

export function off<T extends EventTarget>(
  obj: T | null,
  type: string,
  listener: (e: Event) => void,
  options?: boolean | EventListenerOptions
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(type, listener, options);
  }
}

export const isBrowser = typeof window !== 'undefined';

export const isNavigator = typeof navigator !== 'undefined';
