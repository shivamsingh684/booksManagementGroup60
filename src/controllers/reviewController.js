const userModel= require("../Models/userModel")
const bookModel = require('../models/bookModel');
const reviewModel = require('../Models/reviewModel')
const validator = require('../validation/validator');

const review = async function (req, res) {
try {
    let bookId = req.params.bookId
    let data=req.body
    if (!bookId) { return res.status(400).send({ status: false, message: "please give bookId" }) }
    const findId = await bookModel.findById({ _id: bookId, isDeleted: false })

    if (!findId) { return res.status(404).send({ status: false, message: "bookId not found" }) }
    data.reviewedAt=new Date()
    let createReview = await reviewModel.create(data);
   return res.status(201).send({ status: true, message: "Success", data: createReview })


}
catch (error) {
return res.status(500).send({ status: false, message: error.message })
}
}
module.exports = {review}