const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32
        },
        description: {
            type: String,
            required: true,
            maxLength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        quantity: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        shipping: {
            required: false,
            type: Boolean
        }
    },
    { timestamps: true }
);

productSchema.index({ createdAt: -1 });
productSchema.index({ sold: -1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 1 });

module.exports = mongoose.model("Product", productSchema);