const express=require('express')
const router=express.Router()
const {createUser,loginUser}=require("../controllers/userController")

const { createBook,getBooks ,getbookbyid,deleted}=require("../controllers/bookController")



router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/getbooks",getBooks)


router.post("/books",createBook)
router.get("/books/:bookId",getbookbyid)
router.delete("/books/:bookId",deleted)


module.exports =router