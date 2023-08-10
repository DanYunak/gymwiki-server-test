import productService from '../services/productService.js'
import { capitaliseParam } from './exerciseContoller.js'

class ProductController {
    async getProductsByPriceRange(req, res, next) {
        try {
            const { minPrice, maxPrice } = req.query

            console.log(minPrice, maxPrice)

            const products = await productService.getProductsByPriceRange(minPrice, maxPrice)

            return res.json(products)
        } catch(e) {
            next(e)
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const products = await productService.getAllProducts()

            return res.json(products)
        } catch (e) {
            next(e)
        }
    }

    async createProduct(req, res, next) {
        try {
            const product = await productService.createProduct(req.body)

            return res.json(product)
        } catch (e) {
            next(e)
        }
    }

    async editProduct(req, res, next) {
        try {
            const { id } = req.params
            const editedProduct = await productService.editProduct(id, req.body)

            return res.json(editedProduct)
        } catch (e) {
            next(e)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params
            const deletedProduct = await productService.deleteProduct(id)

            return res.json(deletedProduct)
        } catch (e) {
            next(e)
        }
    }

    async addToCart(req, res, next) {
        try {
            const { userId, productId } = req.body

            const product = await productService.addToCart(userId, productId, res)

            return res.json(product)
        } catch(e) {
            next(e)
        }
    }

    async getCartProducts(req, res, next) {
        try {
            const { userId } = req.query

            const products = await productService.getCartProducts(userId)

            return res.json(products)
        } catch(e) {
            next(e)
        }
    }

    async removeProductFromCart(req, res, next) {
        try {
            const { userId } = req.body
            const { productId } = req.params

            const deletedProduct = await productService.removeProductFromCart(userId, productId)

            return res.json(deletedProduct)
        } catch(e) {
            next(e)
        }
    }

    async decreaseProductQuantityInCart(req, res, next) {
        try {
            const { userId } = req.body
            const { productId } = req.params

            const cart = await productService.decreaseProductQuantityInCart(userId, productId)
            
            return res.json(cart)
        } catch(e) {
            next(e)
        }
    }

    async increaseProductQuantityInCart(req, res, next) {
        try {   
            const { userId } = req.body
            const { productId } = req.params

            const cart = await productService.increaseProductQuantityInCart(userId, productId)

            return res.json(cart)
        } catch(e) {
            next(e)
        }
    }

    async getProductsByCategory(req, res, next) {
        try {
            const { category } = req.params
            const categoryCapitalized = capitaliseParam(category)

            const products = await productService.getProductsByCategory(categoryCapitalized)
            
            return res.json(products)
        } catch(e) {
            next(e)
        }
    }

    async clearCart(req, res, next) {
        try {
            const { userId } = req.body

            console.log(userId)

            const clearedCart = await productService.clearCart(userId)

            return res.json(clearedCart)
        } catch(e) {
            next(e)
        }
    }
}

export default new ProductController()