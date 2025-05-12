// src/middlewares/crud.js
import prisma from '../prisma/client.js'

/**
 * Transforme les données reçues pour coller au schéma Prisma :
 * - utilise les champs camelCase envoyés par le front
 * - connecte les relations categorie/pays
 */
function transformTournoiData(body) {
  const {
    categorieId,
    countryId,
    dateDebut,
    dateFin,
    ...rest
  } = body

  return {
    ...rest,
    // Prisma attend les clés camelCase
    dateDebut,
    dateFin,
    categorie: { connect: { id: categorieId } },
    pays:      { connect: { id: countryId } }
  }
}

/**
 * Crée un nouvel enregistrement dans le modèle Prisma correspondant.
 */
export function createOne(modelName) {
  return async (req, res, next) => {
    try {
      let data = { ...req.body }
      if (modelName === 'tournoi') {
        data = transformTournoiData(data)
      }
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
      let data = { ...req.body }
      if (modelName === 'tournoi') {
        data = transformTournoiData(data)
      }
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
