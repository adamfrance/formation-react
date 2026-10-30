// Petits outils sur les objets de données

// Valeur d'un chemin pointé : getPath(user, 'hair.color')
export function getPath(object, dottedKey) {
  return dottedKey.split('.').reduce((value, key) => (value == null ? undefined : value[key]), object)
}

// L'objet sans les clés données (ex. l'empreinte du mot de passe)
export function omit(object, keys) {
  return Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)))
}

// Les clés dangereuses pour la fusion d'objets venus du client
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
export function safeBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {}
  return Object.fromEntries(Object.entries(body).filter(([key]) => !FORBIDDEN_KEYS.has(key)))
}

// Gèle un objet et tout ce qu'il contient : les données chargées ne peuvent pas être modifiées par erreur
export function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value)) deepFreeze(child)
  }
  return value
}

export const round2 = (number) => Math.round(number * 100) / 100
