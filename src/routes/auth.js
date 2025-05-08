// src/routes/auth.js
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client.js'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'change_me'
const JWT_EXPIRES = '7d'  // durée de vie standard

// --- 1) Inscription (rôle "user" par défaut) ---
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    // Hash du mot de passe
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hash }
    })

    // Assignation du rôle "user"
    const userRole = await prisma.role.findUnique({ where: { name: 'user' } })
    if (userRole) {
      await prisma.userRole.create({
        data: { userId: user.id, roleId: userRole.id }
      })
    }

    // Création du JWT avec roles
    const token = jwt.sign(
      { userId: user.id, roles: ['user'] },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.status(201).json({ token })
  } catch (err) {
    if (err.code === 'P2002') {
      // Violation unique (email déjà utilisé)
      return res.status(409).json({ message: 'Email déjà utilisé' })
    }
    next(err)
  }
})

// --- 2) Connexion ---
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    // Récupère tous les rôles de l'utilisateur
    const roles = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true }
    })
    const roleNames = roles.map(r => r.role.name)

    // Création du JWT
    const token = jwt.sign(
      { userId: user.id, roles: roleNames },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.json({ token })
  } catch (err) {
    next(err)
  }
})

// --- 3) Accès invité (lecture seule) ---
router.get('/guest', (req, res, next) => {
  try {
    // Génère un JWT valable 1 heure pour le rôle "invite"
    const token = jwt.sign(
      { roles: ['invite'] },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.json({ token })
  } catch (err) {
    next(err)
  }
})

export default router
