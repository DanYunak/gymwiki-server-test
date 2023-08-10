import { validationResult } from 'express-validator'
import ApiError from '../exceptions/apiError.js'
import userService from '../services/userService.js'

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const { email, password } = req.body
            const userData = await userService.registration(email, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies

            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')

            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies

            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()

            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { userId } = req.params

            const deletedUser = await userService.deleteUser(userId)

            return res.json(deletedUser)
        } catch (e) {
            next(e)
        }
    }

    async getUserById(req, res, next) {
        try {
            const { userId } = req.query

            const user = await userService.getUserById(userId)

            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }

            return res.json(user)
        } catch (e) {
            next(e)
        }
    }
}

export default new UserController()