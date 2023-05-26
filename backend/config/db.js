require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://muhammedsalihke:DDDEA-mongodb@cluster21.balpjyp.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true, 
    useUnifiedTopology:true,
})
.then(() => {
    console.log("DB Connected")
}).catch((err) => console.log(err));