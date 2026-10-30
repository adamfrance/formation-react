// Les avatars : /icon/:seed/:size ; le PNG enregistré s'il existe, sinon une icône SVG générée
import { existsSync } from 'node:fs'
import path from 'node:path'
import { identiconSvg } from '../utils/identicon.js'
import { badRequest } from '../utils/httpError.js'

const SEED = /^[A-Za-z0-9_.-]{1,64}$/ // pas de « / » ni de « .. » : aucun accès possible hors du dossier des icônes

export function createIconController(publicDir) {
  const iconDir = path.join(publicDir, 'icon')

  return {
    show(req, res) {
      const { seed, size: rawSize = '100' } = req.params
      const size = Number(rawSize)
      if (!SEED.test(seed) || seed.includes('..')) throw badRequest('Invalid icon seed')
      if (!Number.isInteger(size) || size < 1 || size > 1_000) throw badRequest('Invalid icon size')

      res.set('Cache-Control', 'public, max-age=86400')
      const file = path.join(iconDir, seed, `${size}.png`)
      if (req.query.type !== 'svg' && existsSync(file)) return res.sendFile(file)
      res.type('image/svg+xml').send(identiconSvg(seed, size))
    },
  }
}
