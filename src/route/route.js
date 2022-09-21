const express=require('express')
const router=express.Router()
const {createUser,loginUser}=require("../controllers/userController")
const valid=require("../validation/validation")
const getbookDetails=require("../controllers/bookController")



router.post("/register",valid.uservalidation,createUser)
router.post("/login",loginUser)
router.get("/getbooks",getbookDetails.getBooks)




module.exports =router