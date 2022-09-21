const express=require('express')
const router=express.Router()
const {createUser,loginUser}=require("../controllers/userController")

const { createBook ,getbookbyid}=require("../controllers/bookController")



router.post("/register",createUser)
router.post("/login",loginUser)

router.post("/books",createBook)
router.get("/books/:bookId",getbookbyid)


module.exports =router