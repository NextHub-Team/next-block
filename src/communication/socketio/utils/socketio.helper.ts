import { SOCKETIO_DEFAULT_NAMESPACE } from '../types/socketio-const.type';

/** Ensure namespace has a leading slash and fallback to /ws */
export function normalizeNamespace(namespace?: string): string {
  const raw = (namespace ?? '').trim();
  if (!raw) return SOCKETIO_DEFAULT_NAMESPACE;
  return raw.startsWith('/') ? raw : `/${raw}`;
}
