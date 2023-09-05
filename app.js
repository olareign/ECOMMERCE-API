require('dotenv').config()
require('express-async-errors')
const express = require('express')

//router
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')

const { authenticateUser } = require('./middleware/authentication')

const app = express()


//rest of the packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

//database
const connectDB = require('./db/connect')

//middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const notfoundMiddleware = require('./middleware/not-found')

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())



app.get('/', (req, res) => {
    res.send('hello ecommerse')
})

app.get('/api/v1', (req, res) => {
    // console.log(req.cookies);
    console.log(req.signedCookies);
    res.send('hello ecommerse')
})


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', authenticateUser, userRouter)
app.use('/api/v1/products', authenticateUser, productRouter)
app.use('/api/v1/reviews', authenticateUser, reviewRouter)

app.use(notfoundMiddleware) 
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server listening on port ${port}...`)
        });
    } catch (error) {
        console.log(error);
    }
}

start();