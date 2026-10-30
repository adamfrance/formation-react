// Écritures SIMULÉES, comme DummyJSON : la réponse montre le résultat, mais rien n'est enregistré
import { omit, safeBody } from '../utils/objects.js'

const NEVER_RETURNED = ['password', 'passwordHash']

const address = () => ({
  address: '', city: '', state: '', stateCode: '', postalCode: '', coordinates: { lat: null, lng: null }, country: '',
})

// Le modèle d'un utilisateur créé par POST /users/add (champs vides, rôle « user »), dans l'ordre de DummyJSON
const userTemplate = () => ({
  firstName: '', lastName: '', maidenName: '', age: null, gender: '', email: '', phone: '', username: '',
  birthDate: '', image: '', bloodGroup: '', height: null, weight: null, eyeColor: '', hair: { color: '', type: '' },
  ip: '', address: address(), macAddress: '', university: '',
  bank: { cardExpire: '', cardNumber: '', cardType: '', currency: '', iban: '' },
  company: { department: '', name: '', title: '', address: address() },
  ein: '', ssn: '', userAgent: '', crypto: { coin: '', wallet: '', network: '' }, role: 'user',
})

// Le nouvel élément prend l'identifiant suivant le dernier (ex. 209 pour les 208 utilisateurs)
export function simulateAdd(resource, collection, body) {
  const data = safeBody(body)
  delete data.id
  const base = resource === 'users' ? { ...userTemplate(), ...data } : data
  return omit({ id: collection.size + 1, ...base }, NEVER_RETURNED)
}

export function simulateUpdate(item, body) {
  const data = safeBody(body)
  delete data.id
  return omit({ ...item, ...data, id: item.id }, NEVER_RETURNED)
}

export function simulateDelete(item) {
  return { ...item, isDeleted: true, deletedOn: new Date().toISOString() }
}

// POST /comments/add : la réponse remplace userId par l'auteur (id, identifiant, nom complet)
export function simulateAddComment(comments, user, { body, postId }) {
  return {
    id: comments.size + 1,
    body,
    postId,
    user: { id: user.id, username: user.username, fullName: `${user.firstName} ${user.lastName}` },
  }
}
