import { Router } from 'express'
import userController from '../controllers/userController.js'
import { body } from 'express-validator'

const router = new Router()

const { registration, login, logout, refresh, getAllUsers, deleteUser, getUserById } = userController

router.get('/refresh', refresh)
router.get('/users', getAllUsers)
router.get('/user', getUserById)

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 4, max: 32 }),
    registration
)
router.post('/login', login)
router.post('/logout', logout)

router.delete('/user/delete/:userId', deleteUser)

export default router