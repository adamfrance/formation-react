import type { CSSProperties } from 'react'

interface AvatarProps {
  name: string // obligatoire : sert à calculer les initiales
  src?: string // facultatif : adresse de la photo
  size?: number // facultatif : taille en pixels
}

// « Emily Johnson » → « EJ » : affiché quand il n'y a pas de photo
function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Avatar({ name, src, size = 56 }: AvatarProps) {
  const style: CSSProperties = { width: size, height: size, fontSize: size * 0.4 } // un objet, propriétés en camelCase

  if (!src) {
    return (
      <span className="avatar avatar-initials" style={style} aria-hidden="true">
        {initials(name)}
      </span>
    )
  }
  return <img className="avatar" src={src} alt="" width={size} height={size} style={style} loading="lazy" />
}

export default Avatar
