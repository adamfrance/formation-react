import { onCLS, onINP, onLCP } from 'web-vitals'
import type { Metric } from 'web-vitals'

// Envoie une mesure ou une erreur au service de suivi : ici la console ; en production, un service
// (Sentry, Datadog…) ou une adresse de votre API, avec navigator.sendBeacon
function send(kind: string, data: unknown) {
  console.log(`[suivi] ${kind}`, data)
}

// Les signaux web essentiels (Core Web Vitals), mesurés chez chaque visiteur
export function startMonitoring() {
  // CLS est un score sans unité (bon en dessous de 0,1) ; LCP et INP sont en millisecondes
  const report = ({ name, value, rating }: Metric) =>
    send('web-vitals', { name, value: name === 'CLS' ? Number(value.toFixed(3)) : Math.round(value), rating })
  const options = { reportAllChanges: true } // chaque nouvelle valeur, pour la démonstration
  onLCP(report, options) // affichage du plus grand élément visible
  onINP(report, options) // réactivité aux clics et aux frappes
  onCLS(report, options) // stabilité de la mise en page
}

// Les erreurs attrapées par les Error Boundaries
export function reportError(error: unknown) {
  send('erreur', error instanceof Error ? error.message : String(error))
}
