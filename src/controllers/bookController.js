const mongoose = require('mongoose');
const userModel= require("../Models/userModel")
const bookModel = require('../models/bookModel');
const reviewModel = require('../Models/reviewModel')
const { isValid, isValidName } = require('../validation/validator');

const createBook = async (req, res) => {
    try {
        let data = req.body

        const { title, excerpt, userId, ISBN, category, subcategory} = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide a valid data" })
        }

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title must be a present" })
        }
       // title = title.trim()
        if (!isValidName(title)) {
            return res.status(400).send({
                status: false,
                message: "Title should be string..!!"
            })
        }

        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "Excerpt must be a present" })
        }

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "UserId must be a present" })
        }

        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN must be a present" })
        }

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Category must be a present" })
        }

        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "Subcategory must be a present" })
        }

        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "Title already exists" })
        }

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({ status: false, message: "ISBN already exists" })
        }

        let savedData = await bookModel.create(data)

        return res.status(201).send({ status: true, data: savedData })

    } catch (error) {
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


module.exports = { createBook ,getbookbyid}