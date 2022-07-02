const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        username: {type: String, lowercase: true, unique: true, required: true},
        hash: {type: String},
        salt: {type: String},
        access: {type: String, required: true}
    },
    {
        timestamps: true
    }
);

mongoose.model('Users', userSchema);