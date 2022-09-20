const express=require('express')
const router=express.Router()
const {createUser,loginUser}=require("../controllers/userController")
const valid=require("../validation/validation")



router.post("/register",valid.uservalidation,createUser)
router.post("/login",loginUser)



module.exports =router