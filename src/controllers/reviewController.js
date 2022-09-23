const userModel = require("../Models/userModel")
const bookModel = require('../Models/bookModel');
const reviewModel = require('../Models/reviewModel')
const validator = require('../validation/validator');

const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let data = req.body
        let { reviewedBy, rating, review } = data


        if (!validator.isvalidReqBody(data)) return res.status(400).send({ status: false, message: "Please, provide book details to create book...!" })
        if (!validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please,enter valid bookId....!" })


        //bookId validation
        let checkBook = await bookModel.findOne({ _id: bookId });
        if (checkBook.isDeleted == true) return res.status(400).send({ status: false, message: "Book is deleted...!" })
        
        //reviewBy
        if (!validator.regexSpaceChar(reviewedBy)) return res.status(400).send({ status: false, message: "reviewedBy name is not valid format...!" });

        //rating
        if (!Number.isInteger(rating)) return res.status(400).send({ status: false, message: "rating should be integer" })
        if (!(rating >= 1 && rating <= 5)) return res.status(400).send({ status: false, message: "Rating should be inbetween 1-5 " });

        //review
        if (!validator.valid(review) || !validator.regexSpaceChar(review)) return res.status(400).send({ status: false, message: "review name is not valid format...!" });

         const reviewedData = { bookId, reviewedBy, reviewedAt: new Date(), rating, review }

        //review
        if (review == undefined)
            delete reviewedData.review

        let saveReview = await reviewModel.create(reviewedData)
        let obj = saveReview.toObject();
        delete obj.isDeleted;
        delete obj.__v;

        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })
        return res.status(201).send({ status: true, message: "Review given successfully", data: obj })

    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
const updateReview=async function(req,res){
    let bookId=req.params.bookId
    let reviewId=req.params.reviewId
    let data=req.body
    let reviewedBy=data.reviewedBy
    let review=data.review
    let rating=data.rating
    if (!validator.isvalidReqBody(data)) return res.status(400).send({ status: false, message: "Please, provide  details to update review book...!" })
    if(!validator.isValidObjectId(bookId)) return res.status(400).send({status:false,message:"book id is not valid"})
    let book = await bookModel.findById(bookId)
    if (!validator.valid(book))  return res.status(404).send({ status: false, msg: "book not found" })
    
    if(!validator.isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"review id is not valid"})
    let reviews = await reviewModel.findById(reviewId)
    if (!validator.valid(reviews))  return res.status(404).send({ status: false, msg: "review not found" })
    if(rating < 1 || rating >5){
        return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })
    }
    let update=await reviewModel.findOneAndUpdate({_id:reviewId},{$set:{reviewedBy:reviewedBy,rating:rating,review:review},},{new:true}).select({ isDeleted: 0, __v: 0 })
     return res.status(200).send({status: true, msg: "blog updated successfuly", data: update})
    
}
module.exports = {createReview,updateReview}