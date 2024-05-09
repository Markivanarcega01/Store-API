require('dotenv').config()
require('express-async-errors')
const connectDB = require('./db/connect')
const express = require('express')
const app  = express()
const productsRouter = require('./routes/routes')

const notFoundMiddlerware = require('./middleware/not-found')
const errorHandlerMiddlerware = require('./middleware/error-handler')

// middleware
app.use(express.json())

// routes

app.get('/',(req,res)=>{
    res.send(`<h1>Hello World</h1>`)
})

// products route
app.use('/api/v1/products',productsRouter)

app.use(notFoundMiddlerware)
app.use(errorHandlerMiddlerware)

const port = process.env.PORT || 5000


const start = async() =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log('Server is Listening')
        })
    }catch(error){
        console.log(error)
    }
}

start()
