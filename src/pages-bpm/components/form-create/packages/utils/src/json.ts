export function parseJson<T = any>(json?: string | T, fallback: T = {} as T): T {
  if (!json) {
    return fallback
  }
  if (typeof json !== 'string') {
    return json
  }
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function toJson(value: unknown, space?: number) {
  return JSON.stringify(value, undefined, space)
}
