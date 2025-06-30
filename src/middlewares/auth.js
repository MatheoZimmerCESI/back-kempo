// src/middlewares/auth.js
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client.js'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'change_me'

/**
 * Middleware pour vérifier la présence, la validité du JWT,
 * et s’assurer que le compte est actif.
 * Ajoute `req.user = { userId, roles: string[] }` si OK.
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant' })
  }

  const token = authHeader.slice(7)
  let payload
  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' })
  }

  try {
    // 1) On récupère l’utilisateur avec son statut
    const userRecord = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true }
    })

    if (!userRecord) {
      return res.status(401).json({ message: 'Utilisateur introuvable' })
    }

    // 2) Vérifier qu’il est actif
    if (!userRecord.isActive) {
      return res.status(403).json({ message: 'Compte inactif' })
    }

    // 3) Charger les rôles
    const userRoles = await prisma.userRole.findMany({
      where: { userId: userRecord.id },
      include: { role: true }
    })
    const roles = userRoles.map(ur => ur.role.name)

    // 4) Exposer l’ID et les rôles
    req.user = {
      userId: userRecord.id,
      roles
    }

    next()
  } catch (err) {
    next(err)
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
