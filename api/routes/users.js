const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const UsersModel = mongoose.model('Users');

router.get('/', async (req, res, next) => {
    try {
        const users = await UsersModel.find().select("name username");
        res.status(200).json({
            count: users.length,
            users: users.map(user => {
                return {
                    name: user.name,
                    username: user.username,
                    access: user.access,
                    _id: user._id,
                    request: {
                        type: "GET",
                        url: "https://localhost:3000/users/" + user._id
                    }
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});


router.post('/signup', async (req, res, next) => {
    console.log(req.file);
    try {
        let user = new UsersModel({
            name: req.body.name,
            username: req.body.username,
            password: Buffer.from(req.body.password).toString('base64'),
            access: req.body.access
        });
        console.log();
        await user.save();

        res.status(200).json({
            message: 'Usuário criado com sucesso!',
            createdUser: {
                name: user.name,
                username: user.username,
                access: user.access,
                _id: user._id,
                request: {
                    type: "GET",
                    url: "https://localhost:3000/Users/" + user._id
                }
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.get('/:userId', async (req, res, next) => {
    const id = req.params.userId;

    try {
        const user = await UsersModel.findOne({ _id: id })
        if (user) {
            res.status(200).json({
                message: 'User Id foi informado',
                createdUser: {
                    name: user.name,
                    username: user.username,
                    access: user.access,
                    _id: user._id
                }
            })
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.post('/login', async (req, res, next) => {
    try {
        let user = new UsersModel ({
            username: req.body.username,
            password: req.body.password
        })
        const userFind = await UsersModel.findOne({ username : user.username })
        if (userFind) {
            const passwordBd = Buffer.from(userFind.password,'base64').toString('ascii');
            if (passwordBd == user.password) {
                res.status(200).json({
                    message: 'Success'
                })
            }else{
                res.status(401).json({
                    message: "Wrong Password"
                })
            }
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.delete('/:userId', async (req, res, next) => {
    const id = req.params.userId;

    try {
        let status = await UsersModel.deleteOne({ _id: id })

        res.status(200).json({
            message: 'Delete Users',
            status: status
        })

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

module.exports = router;