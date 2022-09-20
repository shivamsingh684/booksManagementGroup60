const express=require('express')
const router=express.Router()
const {createUser}=require("../controllers/userController")
const valid=require("../validation/validation")



router.post("/register",valid.uservalidation,createUser)



module.exports =router