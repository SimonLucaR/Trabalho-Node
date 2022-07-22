const jwt = require('jsonwebtoken');

module.exports = {
    verifyJWT: function (req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token){
            return res.status(401).json({
                auth: false,
                message: 'Token não informado.'
            });
        }

        jwt.verify(token, 'SECRET', function(err, decoded){
            if (err){
                return res.status(401).json({
                    auth: false,
                    message: 'Falha na autenticação do token.'
                })
            }
            req.userId = decoded._id;
            next();
        })
    },
    get_all_users: async (req, res, next) => {
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
    },
    get_info_user: async (req, res, next) => {
        try{
            let user = await UsersModel.findById(req.userId);
            if (user){
                res.status(200).json(user);
            }else{
                res.status(400).json('Usuário não existe!');
            }
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }
    
}

