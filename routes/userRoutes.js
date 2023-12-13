const express=require('express')
const router=express.Router()
const {getAllUsers,createNewUser,updateUser,deleteUser}=require('../controllers/userController')
const verifyJWT=require('../middleware/verifyJWT')

router.use(verifyJWT)//applies for all the routes below

router.route('/')
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports=router;
