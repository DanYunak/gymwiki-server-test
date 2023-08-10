import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import router from './routes/index.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT || 7000

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use('/', router)

app.use(errorMiddleware) // should be the last in the list of middlewares

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch(e) {
        console.log(e)
    }
}

start()