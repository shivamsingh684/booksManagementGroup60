const express=require('express')
const router=express.Router()
const {createUser,loginUser}=require("../controllers/userController")

const {createBook ,getbookbyid,getBooks,updateBook,deleted}=require("../controllers/bookController")

const{authn,authz}=require('../middleware/auth')

const{createReview,updateReview,deleteBookReview}=require("../controllers/reviewController")


//--------------------⭐User Apis⭐--------------------//


router.post("/register",createUser)
router.post("/login",loginUser)



//--------------------⭐Book apis⭐--------------------//




router.post("/books",authn,createBook)

router.get("/books",authn,getBooks)

router.get("/books/:bookId",authn,getbookbyid)

router.put("/books/:bookId", authn,authz,updateBook)

router.delete("/books/:bookId",authn,authz,deleted)



//--------------------⭐Review Apis⭐--------------------//


router.post("/books/:bookId/review",createReview)

router.put("/books/:bookId/review/:reviewId",updateReview)

router.delete("/books/:bookId/review/:reviewId",deleteBookReview)



module.exports =router