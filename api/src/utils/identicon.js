// Une icône SVG déterministe (motif symétrique 5 × 5) pour un avatar absent des fichiers
import { createHash } from 'node:crypto'

export function identiconSvg(seed, size) {
  const hash = createHash('sha256').update(seed).digest()
  const hue = Math.round((hash[0] / 255) * 360)
  const color = `hsl(${hue}, 55%, 50%)`
  const cell = size / 5
  const cells = []
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      if (hash[1 + row * 3 + col] % 2 === 0) continue
      for (const x of new Set([col, 4 - col])) {
        cells.push(`<rect x="${x * cell}" y="${row * cell}" width="${cell}" height="${cell}"/>`)
      }
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" fill="#f0f0f0"/><g fill="${color}">${cells.join('')}</g></svg>`
  )
}
