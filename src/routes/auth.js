// src/routes/auth.js
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import prisma from '../prisma/client.js'
import dotenv from 'dotenv'
import { authenticate } from '../middlewares/auth.js'

dotenv.config()

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'change_me'
const JWT_EXPIRES = '7d'  // durée de vie standard du token

// --- Configuration SMTP via variables d'environnement ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           // ex. "smtp.mailtrap.io" ou ton SMTP réel
  port: Number(process.env.SMTP_PORT),   // ex. 587 ou 465
  secure: process.env.SMTP_SECURE === 'true', // true si port 465, sinon false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})
// ---------------------------------------------------------

// 1) Inscription
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, password: hash } })
    const userRole = await prisma.role.findUnique({ where: { name: 'user' } })
    if (userRole) {
      await prisma.userRole.create({ data: { userId: user.id, roleId: userRole.id } })
    }
    const token = jwt.sign({ userId: user.id, roles: ['user'] }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
    res.status(201).json({ token })
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Email déjà utilisé' })
    }
    next(err)
  }
})

// 2) Connexion
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    // 1) Recherche de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, isActive: true, deletedAt: true }
    })

    // 2) Bloquer si compte inexistant OU désactivé/supprimé
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }
    if (!user.isActive || user.deletedAt) {
      return res.status(403).json({ message: 'Compte inactif ou supprimé' })
    }

    // 3) Vérification du mot de passe
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    // 4) Création du token avec les rôles
    const rolesData = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true }
    })
    const token = jwt.sign(
      { userId: user.id, roles: rolesData.map(r => r.role.name) },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )
    res.json({ token })

  } catch (err) {
    next(err)
  }
})

// 3) Accès invité
router.get('/guest', (req, res, next) => {
  try {
    const token = jwt.sign({ roles: ['invite'] }, JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  } catch (err) {
    next(err)
  }
})

// 4) Demande de réinitialisation de mot de passe
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email requis' })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // valable 1h
      // Supprime d'abord toute ancienne requête pour cet utilisateur
      await prisma.passwordReset.deleteMany({
        where: { userId: user.id }
      })
      // Puis crée la nouvelle requête
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt
        }
      })

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

      await transporter.sendMail({
        from: process.env.SMTP_FROM,       // ex. "Nippon Kempo Support <no-reply@nipponkempo.com>"
        to: email,
        subject: 'Réinitialisation de mot de passe',
        html: `
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous :</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Ce lien expire dans 1 heure.</p>
          <p>Si vous n’avez pas fait cette demande, ignorez ce message.</p>
        `
      })
    }
    // Réponse toujours générique pour ne pas divulguer l’existence de l’email
    res.json({ message: 'Si cet email existe, vous recevrez un lien de réinitialisation.' })
  } catch (err) {
    next(err)
  }
})

// 5) Réinitialisation effective du mot de passe
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token et nouveau mot de passe requis' })
    }
    const pr = await prisma.passwordReset.findUnique({ where: { token } })
    if (!pr || pr.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Token invalide ou expiré' })
    }
    const hash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: pr.userId }, data: { password: hash } })
    await prisma.passwordReset.delete({ where: { id: pr.id } })
    res.json({ message: 'Mot de passe mis à jour avec succès' })
  } catch (err) {
    next(err)
  }
})

export default router

