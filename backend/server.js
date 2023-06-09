require('./config/db');


const app = require('express')();
const port = process.env.PORT||3001;

const UserRouter = require('./api/final')

const cors = require('cors')

var options = {
    "origin":"*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}
app.use(cors(options))

const bodyParser = require('express').json
app.use(bodyParser())


app.use('/',UserRouter)

app.listen(port, ()=>{
    console.log('Server Running on port',port)
})