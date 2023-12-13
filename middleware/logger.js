const {format}=require('date-fns')
const {v4:uuid}=require('uuid')
const path=require('path')
const { existsSync, mkdir } = require('fs')
const fsPromises=require('fs').promises
const fs=require('fs')

const logEvents=async(message,logFilename)=>{
    const formattedDate=format(new Date(),'yyyy-MM-dd\tHH:mm:ss')
    //console.log(formattedDate)
    logItem=`${formattedDate}\t${uuid()}\t${message}\n`
    if(!existsSync(path.join(__dirname,'..','logs'))){
        await fsPromises.mkdir(path.join(__dirname,'..','logs'))
    await fsPromises.appendFile(path.join(__dirname,'..','logs',logFilename),logItem)
    }

}

const logger=(req,res,next)=>{
    message=`${req.url}\t${req.method}\t${req.headers.origin}`
    logEvents(message,'reqLog.log')
    next()
}

module.exports={logger,logEvents}