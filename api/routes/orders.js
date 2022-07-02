const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const OrdersModel = mongoose.model('Orders');
const ProductsModel = mongoose.model('Products');

router.get('/', async (req, res, next) => {
    try {
        const orders = await OrdersModel.find().select("product quantity _id")
        .populate("product", "name price");
        res.status(200).json({
            caunt: orders.length,
            orders: orders.map(order => {
                return {
                    product: order.product,
                    quantity: order.quantity,
                    _id: order._id,
                    request: {
                        type: "GET",
                        url: "https://localhost:3000/orders/" + order._id
                    }
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

})

router.post('/', async (req, res, next) => {

    try {
        if (!req.body.productId) {
            res.status(400).json({
                message: "Produto não existe"
            });
            return;
        }

        let product = null;
        try {
            product = await ProductsModel.findOne({ _id: req.body.productId})
            if (!product) {
                res.status(400).json({
                    message: "Produto não existe"
                });
                return;
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
            return;
        }

        if (product) {
            let order = new OrdersModel({
                product: req.body.productId,
                quantity: req.body.quantity
            });

            await order.save();


            res.status(200).json({
                message: 'Ordem criada com sucesso !',
                createdOrder: {
                    product: order.product,
                    quantity: order.quantity,
                    _id: order._id,
                    request: {
                        type: "GET",
                        url: "https://localhost:3000/orders/" + order._id
                    }
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }


})


router.get('/:oderId', async (req, res, next) => {
    const id = req.params.oderId;
    try {
        const order = await OrdersModel.findOne({ _id: id })
        .populate("product", "name price")
        res.status(200).json({
            message: 'Success',
            order: order,
            request: {
                type: "GET",
                url: "https://localhost:3000/orders/" + order._id
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

})

router.patch('/:oderId', async (req, res, next) => {
    const id = req.params.oderId;
    const updateFields = {};

    Object.entries(req.body).map(item => {
        console.log(item);
        updateFields[item[0]] = item[1];
    })

    try {
        let status = await OrdersModel.updateOne({ _id: id }, { $set: updateFields });

        res.status(200).json({
            message: 'Update order',
            id: id,
            status: status,
            updateFields: updateFields
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

})

router.delete('/:oderId', async (req, res, next) => {
    const id = req.params.oderId;
    try {
        let status = await OrdersModel.deleteOne({ _id: id });

        res.status(200).json({
            message: 'Delete Order',
            status: status
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

})


module.exports = router;