import ApiError from '../exceptions/apiError.js'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import UserDto from '../dtos/userDto.js'
import tokenService from './tokenService.js'

async function generateAndSaveTokens(userDto) {
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return tokens
}

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest(`User with mail address ${email} already exists`)
        }

        const hashedPassword = await bcrypt.hash(password, 3)
        const user = await User.create({ email, password: hashedPassword })
        const userDto = new UserDto(user)

        const generatedTokens = await generateAndSaveTokens(userDto)

        return { ...generatedTokens, user: userDto }
    }

    async login(email, password) {
        const user = await User.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest('User with this mail is not found')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password')
        }

        const userDto = new UserDto(user)

        const generatedTokens = await generateAndSaveTokens(userDto)
        
        return { ...generatedTokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)

        const generatedTokens = await generateAndSaveTokens(userDto)

        return { ...generatedTokens, user: userDto }
    }

    async getAllUsers() {
        const users = await User.find()
        return users
    }

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId)

        return user
    }

    async getUserById(userId) {
        const user = await User.findById(userId)

        return user
    }
}

export default new UserService()