const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema(
    {
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true},
        quantity: {type: Number, default: 1, required: true}
    },
    {
        timestamps: true
    }
);

mongoose.model('Orders', ordersSchema);