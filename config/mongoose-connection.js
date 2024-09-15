const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
    console.log("Connected to mongo db.")
})

module.exports = mongoose.connection