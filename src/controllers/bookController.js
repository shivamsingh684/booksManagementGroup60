const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const bookModel = require('../models/bookModel');
const {isValid, isValidName} = require('../validation/validator');

const createBook = async (req, res, next) => {
    try {
        let data = req.body

        const {title, excerpt, userId, ISBN, category, subcategory, reviews} = data

        if(Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide a valid data"})
        }

        if(!isValid(title)){
            return res.status(400).send({ status: false, message: "Title must be a present"})
        }
        title = title.trim()
        if (!isValidName(title)) {
            return res.status(400).send({
                status: false,
                message: "Title should be string..!!"
            })
        }

        if(!isValid(excerpt)){
            return res.status(400).send({ status: false, message: "Excerpt must be a present"})
        }

        if(!isValid(userId)){
            return res.status(400).send({ status: false, message: "UserId must be a present"})
        }

        if(!isValid(ISBN)){
            return res.status(400).send({ status: false, message: "ISBN must be a present"})
        }

        if(!isValid(category)){
            return res.status(400).send({ status: false, message: "Category must be a present"})
        }

        if(!isValid(subcategory)){
            return res.status(400).send({ status: false, message: "Subcategory must be a present"})
        }

        let checkTitle = await bookModel.findOne({title: title})
        if(checkTitle){
            return res.status(400).send({ status: false, message: "Title already exists"})
        }

        let checkISBN = await bookModel.findOne({ISBN: ISBN})
        if(checkISBN){
            return res.status(400).send({ status: false, message: "ISBN already exists"})
        }

        let savedData = await bookModel.create(data)

        return res.status(201).send({ status: true, data: savedData})

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {createBook}