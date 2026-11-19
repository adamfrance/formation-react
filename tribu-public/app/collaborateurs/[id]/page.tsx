import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCollaborator, getCollaborators } from '@/lib/api'
import CopyEmailButton from '@/components/CopyEmailButton'
import Posts from '@/components/Posts'

// Les pages produites au build : les douze premiers ; les autres le sont à leur première visite, puis gardées
export async function generateStaticParams() {
  const collaborators = await getCollaborators()
  return collaborators.slice(0, 12).map((c) => ({ id: String(c.id) }))
}

// Le titre de l'onglet, calculé à partir des données
export async function generateMetadata({ params }: PageProps<'/collaborateurs/[id]'>): Promise<Metadata> {
  const { id } = await params
  const collaborator = await getCollaborator(id)
  return { title: collaborator ? `${collaborator.firstName} ${collaborator.lastName}` : 'Introuvable' }
}

export default async function CollaboratorPage({ params }: PageProps<'/collaborateurs/[id]'>) {
  const { id } = await params // les paramètres de l'adresse arrivent dans une promesse
  const collaborator = await getCollaborator(id) // pas de second appel : le résultat est en cache
  if (!collaborator) notFound() // affiche app/not-found.tsx, avec la balise noindex

  const { firstName, lastName, email, image, role, company } = collaborator
  return (
    <article className="detail">
      <header className="detail-header">
        <img className="avatar" src={image} alt="" width={88} height={88} />
        <div>
          <h2>{`${firstName} ${lastName}`}</h2>
          <p>{company.title} · {company.department}</p>
          {role !== 'user' && <span className="badge">{role === 'admin' ? 'Administrateur' : 'Modérateur'}</span>}
          <p><a href={`mailto:${email}`}>{email}</a></p>
          <CopyEmailButton email={email} />
        </div>
      </header>
      <h3 className="page-title">Publications</h3>
      {/* streaming : la fiche part tout de suite, les publications suivent dans la même réponse */}
      <Suspense fallback={<p className="loading">Chargement des publications…</p>}>
        <Posts id={collaborator.id} />
      </Suspense>
    </article>
  )
}
