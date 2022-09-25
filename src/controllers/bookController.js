const mongoose = require('mongoose');
const moment=require('moment')
const userModel= require("../Models/userModel")
const bookModel = require('../Models/bookModel');
const reviewModel = require('../Models/reviewModel')
const validator = require('../validation/validator');
const today = moment();

const createBook = async (req, res) => {
    try {
        let data = req.body

        let { title, excerpt, ISBN, category, reviews, subcategory, releasedAt, userId, isDeleted} = data;

        if (!validator.isvalidReqBody(data)) return res.status(400).send({ status: false, message: "Please, provide book details to create book...!" })

        //title validatation
        if (!validator.valid(title) || !validator.regexSpaceChar(title)) return res.status(400).send({ status: false, message: "book title is required in valid format...!" });
        let checkTitle = await bookModel.findOne({ title: title });
        if (checkTitle) return res.status(400).send({ status: false, message: " Book title is already exist" })

        //excerpt validatation
        if (!validator.valid(excerpt)) return res.status(400).send({ status: false, message: "excerpt is required...!" })
        if (!validator.regexSpaceChar(excerpt)) return res.status(400).send({ status: false, message: "Please enter the proper format excerpt...!" });

        //userId validation
        if (!validator.valid(userId)) return res.status(400).send({ status: false, message: "UserId is required...!" })
         if (req.body.hasOwnProperty('userId')) {
        if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please enter the valid UserId...!" })
         }
        let checkUser = await userModel.findById(userId);
        if (!checkUser) return res.status(404).send({ status: false, message: "user is not found" });

        //ISBN validation
        if (!validator.valid(ISBN)) return res.status(400).send({ status: false, message: "ISBN number is required...!" })
        if (!validator.isbnRegex(ISBN)) return res.status(400).send({ status: false, message: "enter the valid isbn number...!" })
        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ status: false, message: "book with same ISBN is already present...!" })

        //category
        if (!validator.valid(category) || !validator.regexSpaceChar(category)) return res.status(400).send({ status: false, message: "category in valid format is required...!" })

        //subcategory
        if (!validator.valid(subcategory) || subcategory.length == 0) return res.status(400).send({ status: false, message: "Subcategory required in request body...!" })

        //reviews
        if (validator.valid(reviews))
            if (reviews != '0')
                return res.status(400).send({ status: false, message: "review can't set value other than zero while creating new book...!" })

        //releasedAt
        if (!validator.valid(releasedAt)) return res.status(400).send({ status: false, message: "releaseAt is required...!" })
        if (!moment.utc(releasedAt, "YYYY-MM-DD", true).isValid()) return res.status(400).send({ status: false, message: "enter date in valid format eg. (YYYY-MM-DD)...!" })
        let savedUser={title, excerpt, ISBN, category, reviews, subcategory, releasedAt, userId, isDeleted}

        let saveBook = await bookModel.create(savedUser);
        return res.status(201).send({ status: true, message: "Success", data: saveBook })
    } 
    catch (err) { 
        return res.status(500).send({ status: false, message: err.message }); 
    }
}

const getBooks=async function (req,res){
    try{
        let data = req.query
        let query={isDeleted:false,...data}
        // const {userId,category,subcategory}=data
        if (!Object.keys(data).length) {
            let book = await bookModel.find({ $and: [{ isDeleted: false }] });
            if (!Object.keys(book).length) {
                return res.status(404).send({ status: false, message: "no book exist" });
            }
            return res.status(200).send({ status: true,message:"Ok" ,data: book });
        } else {
            let book = await bookModel.find(query).select({title:1,excerpt:1,userId:1,reviews:1,category:1,releaseAt:1,_id:1}).sort({title:1});
            if (!Object.keys(book).length) {
                return res.status(404).send({ status: false, message: " No such book exist" });
            }
        
            return res.status(200).send({ status: true,message:"getbooklists", data: book});
            // return res.status(200).send({ status: true, list: books });
           
        }
    }catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getbookbyid = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) { return res.status(400).send({ status: false, message: "please give bookId" }) }
        const findId = await bookModel.findById({ _id: bookId, isDeleted: false }).select({_id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, isDeleted: 1, reviews: 1, releasedAt: 1, createdAt: 1, updatedAt: 1})

        if (!findId) { return res.status(404).send({ status: false, message: "bookId not found" }) }

        const reviewdata = await reviewModel.find({ bookId:findId._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        if(!reviewdata){
            return res.status(404).send({ status: false, message: "reviewData is not found" })    
        }

        const bookdetails = {
            _id: findId._id,
            title: findId.title,
            excerpt: findId.excerpt,
            userId: findId.userId,
            category: findId.category,
            subcategory: findId.subcategory,
            isDeleted: findId.isDeleted,
            reviews: findId.reviews,
            releasedAt: findId.releasedAt,
            createdAt: findId.createdAt,
            updatedAt: findId.updatedAt,
            reviewsData: reviewdata
        }

        // const bookdetails = findId._doc["reviewsData"] = reviewdata;
      res.status(200).send({status:true,message:'Book list',data:bookdetails})

    }
catch (error) {
    return res.status(500).send({ status: false, message: error.message })
}
}

const updateBook = async (req, res) => {
    try {
        let data = req.body;
        let bookId = req.params.bookId;

        if (!validator.isValidObjectId(bookId)){
            return res.status(400).send({ Status: false, message: "Please enter valid bookId" });
        }
        let { title, excerpt, ISBN } = data;

        if (!validator.isvalidReqBody(data)) return res.status(400).send({ status: false, message: "Please, provide book details to update book...!" })

        const book = {}
        //title validatation
        if(title){
            if (!validator.valid(title) || !validator.regexSpaceChar(title)) return res.status(400).send({ status: false, message: "book title is required in valid format...!" });
            let checkTitle = await bookModel.findOne({ title: title });
            if (checkTitle) return res.status(400).send({ status: false, message: " Book title is already exist" })
            book.title = title
        }

        //ISBN validation
        if(ISBN){
            if (!validator.valid(ISBN)) return res.status(400).send({ status: false, message: "ISBN number is required...!" })
            if (!validator.isbnRegex(ISBN)) return res.status(400).send({ status: false, message: "enter the valid isbn number...!" })
            let checkISBN = await bookModel.findOne({ ISBN: ISBN, isDeleted: false })
            if (checkISBN) return res.status(400).send({ status: false, message: "book with same ISBN is already present...!" })
            book.ISBN = ISBN
        }

        if(excerpt){
            book.excerpt = excerpt
        }

        book.releasedAt = today.format("YYYY-MM-DD")

        let findbook = await bookModel.findById(bookId);
        if (!findbook){
            return res.status(404).send({ status:false ,message: "bookId is invalid" });
        }

        if (findbook.isDeleted){
            return res.status(404).send({status:false, message: "Bookdata is already deleted" });
        }

        if (!findbook.isDeleted) {
            let updatedBook = await bookModel.findOneAndUpdate(
                { _id: bookId },
                book,
                { new: true }
            );
            return res.status(200).send({ status: true, message :"update sucsessfully",data: updatedBook });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const deleted = async function (req, res) {
    try {
    
        
        let bookId = req.params.bookId
       
        if(!validator.isValidObjectId(bookId)) return res.status(400).send({status: false,message: "invalid bookId"})

        let book = await bookModel.findById(bookId)
        if (!validator.valid(book)) {
            return res.status(404).send({ status: false, message: "book not found" })
        }
        if (book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "this book is already deleted" })
        }
        if (book.isDeleted == false) {
            let deletetion = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } })
            return res.status(200).send({ status: true, message: "book is deleted successfully" })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createBook ,getbookbyid,getBooks,updateBook,deleted}
