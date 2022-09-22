const express=require('express')
const router=express.Router()
const {createUser,loginUser}=require("../controllers/userController")

const { createBook,getBooks ,getbookbyid}=require("../controllers/bookController")

const{review}=require("../controllers/reviewController")


router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/getbooks",getBooks)


router.post("/books",createBook)
router.get("/books/:bookId",getbookbyid)

router.post("/books/:bookId/review",review)
module.exports =router