import {Option} from "../option/option"
import {optionOf} from "../option/optionOf"

function isObject(e: unknown): e is object {
  return e != null && typeof e === "object"
}

export function parseString(s: any) {
  return s != null ? String(s) : ""
}

export function parseBool(b: any) {
  return b != null ? Boolean(b) : false
}

export function parseNumber(b: any) {
  return b == null || isNaN(b) ? 0 : Number(b)
}

export function parseArray<T>(e: any, fn: (value: any) => T): T[] {
  return Array.isArray(e) ? e.map(fn) : []
}

export function parseMap<K, V>(
  e: unknown,
  {parseKey, parseValue}: {parseKey: (k?: unknown) => K; parseValue: (v?: unknown) => V}
): Map<K, V> {
  if (isObject(e)) {
    return new Map(
      Object.keys(e).map(key =>
        parseMapEntry([key, e[key as keyof typeof e]], {parseKey, parseValue})
      )
    )
  }
  return new Map()
}

export function parseRecord<V>(
  e: unknown,
  {parseValue}: {parseValue: (v?: unknown) => V}
): Record<string, V> {
  if (isObject(e)) {
    const result: Record<string, V> = {}
    for (const key of Object.keys(e)) {
      result[key] = parseValue(e[key as keyof typeof e])
    }
    return result
  }
  return {}
}

export function parseMapEntry<K, V>(
  entry: unknown,
  {parseKey, parseValue}: {parseKey: (k?: unknown) => K; parseValue: (v?: unknown) => V}
): [K, V] {
  if (Array.isArray(entry)) {
    return [parseKey(entry[0]), parseValue(entry[1])]
  }
  return [parseKey(), parseValue()]
}

export function parseObject<T>(param: unknown): Option<Partial<T>> {
  return optionOf(param).map(e => (typeof param === "object" ? (e as {}) : {}))
}
