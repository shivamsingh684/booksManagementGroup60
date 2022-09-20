
const userModel= require("../Models/userModel")




const createUser = async function (req, res) {
    try {
        let data = req.body
        const CreatedData = await userModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: CreatedData })
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})

    }
}

module.exports={createUser}