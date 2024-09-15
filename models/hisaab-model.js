const mongoose = require('mongoose');

const hisaabSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        // minlength:3,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        required:true,
        maxlength: 500
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    encrypted: {
        type: Boolean,
        default: false
    },
    shareable: {
        type: Boolean,
        default: false
    },
    passcode: {
        type: String,
        default:""
    },
    editPermission: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('hisaab', hisaabSchema);
