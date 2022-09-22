const express=require('express')
const router=express.Router()
const {createUser,loginUser}=require("../controllers/userController")

const { createBook,getBooks ,getbookbyid,deleted}=require("../controllers/bookController")

const{authn,authz}=require('../middleware/auth')



router.post("/register",createUser)
router.post("/login",loginUser)

router.post("/books",authn,createBook)
router.get("/getbooks",authn,getBooks)
router.get("/books/:bookId",authn,getbookbyid)


router.delete("/books/:bookId",deleted)

module.exports =router