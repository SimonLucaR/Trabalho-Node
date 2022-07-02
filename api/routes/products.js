const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replaceAll(':', ' ') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const ProductsModel = mongoose.model('Products');

router.get('/', async (req, res, next) => {
    try {
        const products = await ProductsModel.find().select("name price image _id");
        res.status(200).json({
            count: products.length,
            products: products.map(product => {
                return {
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    _id: product._id,
                    request: {
                        type: "GET",
                        url: "https://localhost:3000/products/" + product._id
                    }
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.post('/', upload.single('productImage'), async (req, res, next) => {
    console.log(req.file);
    try {
        let product = new ProductsModel({
            name: req.body.name,
            price: req.body.price,
            image: req.file.path
        });

        await product.save();

        res.status(200).json({
            message: 'Produto criado com sucesso!',
            createdProduct: {
                name: product.name,
                price: product.price,
                image: product.image,
                _id: product._id,
                request: {
                    type: "GET",
                    url: "https://localhost:3000/products/" + product._id
                }
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});


router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    try {
        const product = await ProductsModel.findOne({ _id: id })
        if (product) {
            res.status(200).json({
                message: 'Product Id foi informado',
                product: product
            })
        } else {
            res.status(404).json({
                message: "Produto não existe"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});


router.patch('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    const updateFields = {};

    Object.entries(req.body).map(item => {
        console.log(item);
        updateFields[item[0]] = item[1];
    })

    try {
        let status = await ProductsModel.updateOne({ _id: id }, { $set: updateFields });

        res.status(200).json({
            message: 'Update products',
            id: id,
            status: status,
            updateFields: updateFields
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

})

router.delete('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    try {
        let status = await ProductsModel.deleteOne({ _id: id })

        res.status(200).json({
            message: 'Delete products',
            status: status
        })

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

module.exports = router;