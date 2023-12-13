require('dotenv').config()
const express=require('express')
const path=require('path')
const app=express()
const PORT=process.env.PORT||3500
const {logger,logEvents}=require('./middleware/logger')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const corsOptions=require('./config/corsOptions')
const connectDB=require('./config/dbConn')
const mongoose=require('mongoose')

connectDB()

app.use('/',logger)
app.use(express.json())//to parse json data
app.use('/',express.static(path.join(__dirname,'public')))
app.use(cookieParser())
app.use(cors(corsOptions))


app.use('/',require('./routes/root'))

app.use('/users',require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
app.use('/auth', require('./routes/authRoutes'))

app.all('*',(req,res)=>{
    res.status(404)
    res.sendFile(path.join(__dirname,'views','404.html'))
})

mongoose.connection.once('open',()=>{
console.log("connected to DB")
app.listen(PORT,()=>{
    console.log("Server is listening")
})
})

mongoose.connection.on('error',err=>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log')
})

