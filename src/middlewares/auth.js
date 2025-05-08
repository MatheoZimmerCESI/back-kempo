// src/middlewares/auth.js
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client.js'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'change_me'

/**
 * Middleware pour vérifier la présence et la validité du JWT.
 * Ajoute `req.user = { userId, roles: string[] }` si OK.
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant' })
  }

  const token = authHeader.slice(7)
  try {
    // Vérification du token et extraction du payload
    const payload = jwt.verify(token, JWT_SECRET)

    // Récupère les rôles de l’utilisateur
    const userRoles = await prisma.userRole.findMany({
      where: { userId: payload.userId },
      include: { role: true }
    })

    // On expose userId et roles dans req.user
    req.user = {
      userId: payload.userId,
      roles: userRoles.map(ur => ur.role.name)
    }

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' })
  }
}

/**
 * Middleware usine à autoriser certains rôles.
 * @param {string[]} allowedRoles
 */
export function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' })
    }
    const hasRole = req.user.roles.some(r => allowedRoles.includes(r))
    if (!hasRole) {
      return res.status(403).json({ message: 'Accès refusé' })
    }
    next()
  }
}
