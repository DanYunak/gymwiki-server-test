import { Schema, model } from 'mongoose'

export const categoryEnum = ['Creatines', 'Proteins', 'Vitamins', 'Amino acids', 'Bars', 'Pre-training complexes']

const ProductSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, enum: categoryEnum, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    img: { type: String, required: true }
})

export default model('Product', ProductSchema)