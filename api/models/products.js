const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        price: {type: Number, required: true},
        image: {type: String, required: true}
    },
    {
        timestamps: true
    }
);

mongoose.model('Products', productsSchema);