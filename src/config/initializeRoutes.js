// src/config/initializeRoutes.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { authenticate, authorize } from '../middlewares/auth.js'

export default function initializeRoutes(app) {
  // Récupérer __filename en ESM
  const __filename     = fileURLToPath(import.meta.url)
  const routeDirectory = path.join(path.dirname(__filename), '../routes')

  fs.readdir(routeDirectory, (err, files) => {
    if (err) {
      console.error('Erreur lors de la lecture du dossier routes:', err)
      throw err
    }

    files
      .filter((file) => file.endsWith('.js'))
      .forEach(async (routeFile) => {
        const fullPath = path.join(routeDirectory, routeFile)
        try {
          const { default: router } = await import(pathToFileURL(fullPath).href)

          // Cas : auth.js (routes publiques)
          if (routeFile === 'auth.js') {
            app.use('/auth', router)
            console.log('Route chargée : /auth')
            return
          }

          // Cas : tournoi.js (utilisateur authentifié)
          if (routeFile === 'tournoi.js') {
            app.use('/tournoi', authenticate, router)
            console.log('Route chargée : /tournoi (auth required)')
            return
          }

          // Cas : adminTournoi.js (seulement admin)
          if (routeFile === 'adminTournoi.js') {
            app.use('/admin/tournoi', authenticate, authorize(['admin']), router)
            console.log('Route chargée : /admin/tournoi (admin only)')
            return
          }

          // Autres routes publiques
          const mountPath = `/${routeFile.replace('.js', '')}`
          app.use(mountPath, router)
          console.log(`Route chargée : ${mountPath}`)
        } catch (error) {
          console.error(`Erreur lors du chargement de la route ${routeFile}:`, error)
        }
      })
  })
}
