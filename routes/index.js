import { Router } from 'express'
import exerciseRouter from './exerciseRouter.js'
import productRouter from './productRouter.js'
import userRouter from './userRouter.js'

const router = new Router()

router.use('/exercises', exerciseRouter)

router.use('/', userRouter)

router.use('/products', productRouter)


export default router