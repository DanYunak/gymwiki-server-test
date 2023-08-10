import ApiError from '../exceptions/apiError.js'
import Product from '../models/productModel.js'
import Cart from '../models/cartModel.js'

class ProductService {
    async getAllProducts() {
        const products = await Product.find()
        return products
    }

    async createProduct(productData) {
        const { name, category, price, description, img } = productData

        if (!name || !category || !price || !img) {
            throw ApiError.BadRequest('Invalid value')
        }

        const product = await Product.create({ name, category, price, description, img })

        return product
    }

    async editProduct(id, productData) {
        if (!id) {
            throw ApiError.BadRequest('ID is not defined')
        }

        const product = await Product.findByIdAndUpdate(id, productData, { new: true })

        return product
    }

    async deleteProduct(id) {
        if (!id) {
            throw ApiError.BadRequest('ID is not defined')
        }

        const product = await Product.findByIdAndDelete(id)

        return product
    }

    async addToCart(userId, productId, res) {
        try {
            const cart = await Cart.findOne({ userId: userId })
            if (cart) {
                const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId)
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity += 1
                } else {
                    cart.products.push({ productId: productId, quantity: 1 })
                }
                await cart.save()

                return res.status(200).json({ message: 'Product was successfully added to the cart' })
            } else {
                const newCart = new Cart({
                    userId: userId,
                    products: [{ productId: productId, quantity: 1 }],
                })
                await newCart.save()

                return res.status(200).json({ message: 'Product was successfully added to the cart' })
            }
        } catch (e) {
            console.error(e)
            res.status(500).json({ error: 'Server error' })
        }
    }

    async getCartProducts(userId) {
        try {
            const cart = await Cart.findOne({ userId: userId }).populate('products.productId')

            if (cart) {
                return cart.products
            } else {
                return []
            }
        } catch (e) {
            return ApiError.BadRequest('Server error')
        }
    }

    async removeProductFromCart(userId, productId) {
        try {
            const cart = await Cart.findOne({ userId })

            if (!cart) {
                throw ApiError.BadRequest('Cart not found')
            }

            const productIndex = cart.products.findIndex(
                (item) => item.productId.toString() === productId
            )

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1)
                await cart.save()
                return { message: 'Product was successfully removed from the cart' }
            } else {
                throw ApiError.BadRequest('Product not found in the cart')
            }
        } catch (e) {
            return ApiError.BadRequest('Server error')
        }
    }

    async decreaseProductQuantityInCart(userId, productId) {
        try {
            const cart = await Cart.findOne({ userId })

            if (!cart) {
                throw ApiError.BadRequest('Cart not found')
            }

            cart.decreaseQuantity(productId)
            await cart.save()
            return cart
        } catch (e) {
            return ApiError.BadRequest('Server error')
        }
    }

    async increaseProductQuantityInCart(userId, productId) {
        try {
            const cart = await Cart.findOne({ userId })

            if (!cart) {
                throw ApiError.BadRequest('Cart not found')
            }

            cart.increaseQuantity(productId)
            await cart.save()
            return cart
        } catch(e) {
            return ApiError.BadRequest('Server error')
        }
    }

    async getProductsByCategory(category) {
        try {
            const products = await Product.find({ category })

            return products
        } catch (e) {
            return ApiError.BadRequest('Server error')
        }
    }

    async getProductsByPriceRange(minPrice, maxPrice) {
        try {
            const products = await Product.find({
                price: { $gte: minPrice, $lte: maxPrice }
            })
            
            console.log(products)

            return products
        } catch (e) {
            return ApiError.BadRequest('Server error')
        }
    }

    async clearCart(userId) {
        try {
            const cart = await Cart.findOne({ userId })

            if (!cart) {
                throw ApiError.BadRequest('Cart not found')
            }

            cart.products = []
            await cart.save()

            return { message: 'Cart was successfully cleared' }
        } catch(e) {
            return ApiError.BadRequest('Server error')
        }
    }
}

export default new ProductService()