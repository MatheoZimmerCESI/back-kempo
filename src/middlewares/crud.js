// src/middlewares/crud.js
import prisma from '../prisma/client.js'

/**
 * Crée un nouvel enregistrement dans le modèle Prisma correspondant.
 * @param {string} modelName Le nom du modèle Prisma (ex. 'club', 'categorie', etc.)
 */
export function createOne(modelName) {
  return async (req, res, next) => {
    try {
      const data = req.body
      const result = await prisma[modelName].create({ data })
      res.status(201).json({ id: result.id })
    } catch (err) {
      next(err)
    }
  }
}

/**
 * Récupère tous les enregistrements d’un modèle Prisma.
 */
export function getAll(modelName) {
	return async (req, res, next) => {
	  try {
		const items = await prisma[modelName].findMany()
		res.status(200).json(items)
	  } catch (err) {
		next(err)
	  }
	}
  }

/**
 * Récupère un enregistrement par son ID.
 */
export function getOneByID(modelName) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const item = await prisma[modelName].findUnique({ where: { id } })
      if (!item) return res.status(404).json({ message: 'Élément non trouvé' })
      res.status(200).json(item)
    } catch (err) {
      next(err)
    }
  }
}

/**
 * Met à jour un enregistrement par son ID.
 */
export function updateByID(modelName) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const data = req.body
      await prisma[modelName].update({
        where: { id },
        data
      })
      res.status(200).json({ success: true })
    } catch (err) {
      next(err)
    }
  }
}

/**
 * Supprime un enregistrement par son ID.
 */
export function deleteByID(modelName) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      await prisma[modelName].delete({ where: { id } })
      res.status(200).json({ success: true })
    } catch (err) {
      next(err)
    }
  }
}
