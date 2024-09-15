const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true,
        trim: true,
        maxlength: 30
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: false,
        minlength: 4,
        maxlength: 128
    },
    profilePicture: {
        type: String,
        default: 'defaultProfilePicture.jpg'
    },
    hisaab: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hisaab'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);;
