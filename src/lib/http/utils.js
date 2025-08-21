export function toQuery(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return '';
  const usp = new URLSearchParams();
  for (const [k, v] of entries) {
    if (Array.isArray(v)) v.forEach((vv) => usp.append(k, String(vv)));
    else usp.set(k, String(v));
  }
  return `?${usp.toString()}`;
}

export function normalizeError(e) {
  const status = e?.response?.status ?? e?.status ?? 0;
  const message = e?.response?.data?.message || e?.message || 'Unexpected error';
  const code = e?.response?.data?.code || statusCodeToCode(status);
  const details = e?.response?.data?.details ?? e?.response?.data ?? e?.data;
  const traceId = e?.response?.headers?.['x-trace-id'];
  return { code, message, details, traceId, _raw: e, status };
}

export function statusCodeToCode(status) {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status >= 500) return 'SERVER_ERROR';
  if (status >= 400) return 'BAD_REQUEST';
  return 'UNKNOWN';
}
