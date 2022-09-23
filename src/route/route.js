const express=require('express')
const router=express.Router()
const {createUser,loginUser}=require("../controllers/userController")

const {createBook ,getbookbyid,getBooks,updateBook,deleted}=require("../controllers/bookController")

const{authn,authz}=require('../middleware/auth')

const{review}=require("../controllers/reviewController")


router.post("/register",createUser)
router.post("/login",loginUser)

router.post("/books",authn,createBook)
router.get("/getbooks",authn,getBooks)
router.get("/books/:bookId",authn,getbookbyid)



router.post("/books/:bookId/review",review)
router.put("/books/:bookId", authn,authz,updateBook)

router.delete("/books/:bookId",authn,authz,deleted)

module.exports =router