// Le type des variables d'environnement de l'application (sinon import.meta.env.VITE_API_URL serait « any »)
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}
