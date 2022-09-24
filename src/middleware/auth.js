const jwt=require('jsonwebtoken')
const bookModel=require('../Models/bookModel')
const validator=require('../validation/validator')

//------------------⭐Authentication⭐--------------//

let authn = async (req,res,next)=>{
try{
let  token =  req.headers['x-api-key']


  if(!token) 
    return res.send({staus:false,msg:"token is required "})

    let decodedtoken =  jwt.verify(token,"functionUp-project3")
    if (Date.now() > (decoded.exp) * 1000) {
      return res.status(440).send({ status: false, message: "Session expired! Please login again." })
    }
    req.decoded = decodedtoken

    if(!decodedtoken) 
    return res.status(401).send({status:false,msg:"you are Unauthorized"})

    next()
}catch(err){
    res.status(500).send({message:err.message})
} 
}

//--------------------⭐Authorization⭐--------------------//

let authz = async (req,res,next)=>{
  try{

let loginPerson = req.decoded.userId;
  
  let userLogging;
  
  
      /**validation for path params */
      if (req.params.hasOwnProperty('bookId')) {
        if (!validator.isValidObjectId(req.params.bookId))return res.status(400).send({ status: false, msg: "Enter a valid book Id" }) 
  
        let bookData = await bookModel.findById(req.params.bookId);        
  
        if (!bookData)                                          //you entering the author id here of any othor author
          return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });
  
        userLogging = bookData.userId.toString();
    
  
      }
  
       if (loginPerson !== userLogging)
        return res.status(403).send({ status: false, msg: "Error, authorization failed" });
        

next()
    }
    catch(error){
      res.status(500).send({status:false, message:error.message})


    }
}


module.exports = {authn,authz}