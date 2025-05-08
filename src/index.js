import express from 'express'
import cors from 'cors'
import testBDD from './config/testBDD.js'

import authRoutes        from './routes/auth.js'
import competiteurRoutes from './routes/competiteur.js'
import matchRoutes       from './routes/match.js'
import tournoiRoutes     from './routes/tournoi.js'
import clubRoutes        from './routes/club.js'   

const app = express()
const PORT = process.env.PORT

if (!PORT) {
  console.error('Error: PORT environment variable is not defined.')
  process.exit(1)
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Monte les routers sous leur préfixe
app.use('/auth',        authRoutes)
app.use('/competiteur', competiteurRoutes)
app.use('/match',       matchRoutes)
app.use('/tournoi',     tournoiRoutes)
app.use('/club',        clubRoutes)

testBDD()

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
