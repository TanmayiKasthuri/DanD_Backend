const User=require('../models/users')
const Note=require('../models/Note')
//saves us from using try catch blocks while using asynchronous operations like creating data, updating, deleting it and saving it to the database
const asyncHandler=require('express-async-handler')//npm i express-async-handler
const bcrypt=require('bcrypt')
const { sendStatus } = require('express/lib/response')

 const getAllUsers=asyncHandler(async(req,res)=>{
    const users=await User.find().select('-password').lean()//selectively hiding password
    if(!users?.length) return res.status(400).json({message:"No users found"})
    res.json(users)

 })
 const createNewUser=asyncHandler(async(req,res)=>{
    const {username, password, roles}=req.body
    //Confirming if all the data is present
    if(!username ||!password ||!Array.isArray(roles)||!roles.length){
        return res.status(400).json({message:'All fields are required'})
    }
    //Checking for duplicates
    const duplicate=await User.findOne({username}).lean().exec();//if you are using async, await and want to receive a promise back, then you need to add exec()
    if(duplicate){
        return res.status(409).json({message:'Duplicate username'})
    }
    const hashedpwd=await bcrypt.hash(password,10)

    const userObject={username,"password":hashedpwd,roles}
    const user=await User.create(userObject)

    if(user){//user is created
        res.status(201).json({message:`New user ${username} created`})
    }
    else{
        res.status(400).json({message:'Invalid user data received'})
    }

 })
 const updateUser=asyncHandler(async(req,res)=>{
    const {id, username, roles, active, password}=req.body
    if(!id||!username ||!Array.isArray(roles)||!roles.length||typeof active!=='boolean'){
        return res.status(400).json({message:'All fields are required'})
    }
    const user=await User.findById(id).exec()//exec() as findById() has a parameter and there is a promise to return
    if(!user){
        return res.status(400).json({message:'User not found'})
    }
    const duplicate=await User.findOne({username}).lean().exec();//if you are using async, await and want to receive a promise back, then you need to add exec()
    //checking is the new username that we want updated already exists; if it does, you cannot change the username
    if(duplicate && duplicate?._id.toString()!==id){
        return res.status(409).json({message:'Duplicate username'})
    }
    user.username=username
    user.roles=roles
    user.active=active

    if(password){
        user.password=await bcrypt.hash(password,10)
    }

    const updatedUser=await user.save()

    res.json({message:`${updatedUser.username} updated`})
 })
 const deleteUser=asyncHandler(async(req,res)=>{
    const{id}=req.body
    if(!id){
        return res.status(400).json({message:'User id required'})
    }

    const note= await Note.findOne({user:id}).lean().exec()
    if(note){
        return res.status(400).json({message:'User is assigned some notes'})
    }
    const user=await User.findById(id).exec()
    if (!user){
        return res.status(400).json({message:'User not found'})
    }

    const result=await user.deleteOne()

    const reply=`Username ${result.username} is deleted`
    res.json(reply)

 })

 module.exports={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
 }