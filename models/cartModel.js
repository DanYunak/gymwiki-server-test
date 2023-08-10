import { Schema, model } from 'mongoose'

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ]
})

CartSchema.methods.decreaseQuantity = function(productId) {
    const productIndex = this.products.findIndex(item => item.productId.toString() === productId)
    if (productIndex !== -1) {
        if (this.products[productIndex].quantity > 1) {
            this.products[productIndex].quantity -= 1
        } else {
            this.products.splice(productIndex, 1)
        }
    }
}

CartSchema.methods.increaseQuantity = function(productId) {
    const productIndex = this.products.findIndex(item => item.productId.toString() === productId)
    if (productIndex !== -1) {
        this.products[productIndex].quantity += 1
    } else {
        this.products.push({
            productId: productId,
            quantity: 1
        })
    }
}

export default model('Cart', CartSchema)