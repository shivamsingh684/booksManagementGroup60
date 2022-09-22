const jwt=require('jsonwebtoken')
const bookModel=require('../Models/bookModel')

//------------------⭐Authentication⭐--------------//

let authn = async (req,res,next)=>{
try{
let  token =  req.headers['x-api-key']


  if(!token) 
    return res.send({staus:false,msg:"token is required "})

    let decodedtoken =  jwt.verify(token,"Blog")
    req.decoded = decodedtoken

    if(!decodedtoken) 
    return res.status(401).send({status:false,msg:"you are Unauthorized"})

    next()
}catch(err){
    res.status(500).send({msg:err.message})
} 
}

//--------------------⭐Authorization⭐--------------------//

let authz = async (req,res,next)=>{
  
   let bookData = await bookModel.findById(req.params.bookId); 
   if(!bookData) return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });




if(req.decoded.userId !=bookData.userId)
return res.status(403).send({staus:false,msg:"you are not authorized"})

next()
}


module.exports = {authn,authz}