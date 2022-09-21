const mongoose = require('mongoose');
const moment=require('moment')
const userModel= require("../Models/userModel")
const bookModel = require('../models/bookModel');
const reviewModel = require('../Models/reviewModel')
const validator = require('../validation/validator');

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


    } catch (err) { return res.status(500).send({ status: false, message: err.message }); }
}

const getBooks=async function (req,res){
    try{
    let data = req.query
    let query={isDeleted:false,...data}
    // const {userId,category,subcategory}=data
        if (!Object.keys(data).length) {
            let book = await bookModel.find({ $and: [{ isDeleted: false }] });
            if (!Object.keys(book).length) {
                return res.status(404).send({ status: false, msg: "no book exist" });
            }
            return res.status(200).send({ status: true, data: book });
        } else {
            let book = await bookModel.find(query).select({title:1,excerpt:1,userId:1,reviews:1,category:1,releaseAt:1,_id:1}).sort({title:1});
            if (!Object.keys(book).length) {
                return res.status(404).send({ status: false, msg: " No such book exist" });
            }
            
            
        
            return res.status(200).send({ status: true,messege:"getbooklists", data: book});
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
        const findId = await bookModel.findById({ _id: bookId, isDeleted: false })

        if (!findId) { return res.status(404).send({ status: false, message: "bookId not found" }) }

        const reviewdata = await reviewModel.find({ bookId:findId._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })


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
      res.status(200).send({status:true,message:'Book list',data:bookdetails})

    }
catch (error) {
    return res.status(500).send({ status: false, message: error.message })
}
}


module.exports = { createBook ,getbookbyid,getBooks}
