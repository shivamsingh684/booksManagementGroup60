const userModel= require("../Models/userModel")
const {default :mongoose}=require("mongoose")

const uservalidation=async function(req,res,next){
    try{
        let data=req.body;
        let {title,name,email,phone,password,address}=data
        if(!title){return res.status(400).send({status:false,message:"Please provide title"})}
        if(typeof title==='string' && title.trim().length === 0){return res.status(400).send({status:false,message:"title is empty"})}
        if(typeof title !== 'string') {return res.status(400).send({status:false,message:"title should be string"})}
        if (!(/^[a-zA-Z ]{2,30}$/).test(title)) return res.status(400).send({ status: false, message: " Please enter title as A-Z or a-z" })

        if(!name){return res.status(400).send({status:false,message:"Please provide name"})}
        if(typeof name==='string' && name.trim().length === 0){return res.status(400).send({status:false,message:"name is empty"})}
        if(typeof name !== 'string') {return res.status(400).send({status:false,message:"name should be string"})}
        if (!(/^[a-zA-Z ]{2,30}$/).test(name)) return res.status(400).send({ status: false, message: " Please enter name as A-Z or a-z" })

        if(!phone){return res.status(400).send({status:false,message:"Please provide phone"})}
        if(typeof phone==='string' && phone.trim().length === 0){return res.status(400).send({status:false,message:"phone is empty"})}
        if(typeof phone !== 'string') {return res.status(400).send({status:false,message:"phone should be string"})}
        if (!(/^[0]?[6789]\d{9}$/).test(phone.trim())) { return res.status(400).send({ status: false, message: "Please provide valid phone number" }) }
        let mobileNoCheck = await userModel.findOne({ phone: phone })
        if (mobileNoCheck ) { return res.status(400).send({ status: false, message: "This phone number is already registerd" }) }

        if(!email){return res.status(400).send({status:false,message:"Please provide the email"})}
        if(typeof email==='string' && email.trim().length === 0){return res.status(400).send({status:false,message:"email is empty"})}
        if(typeof email !== 'string') {return res.status(400).send({status:false,message:"email should be string"})}
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(email.trim())) { return res.status(400).send({ status: false, message: "Please provide valid email" }) }
         
        let usermail = await userModel.findOne({ email: email })
        if (usermail) { return res.status(400).send({ status: false, message: "This email already exists please provide another email" }) }
        
        if (!password) { return res.status(400).send({ status: false, msg: "please provide the password" }) }
        function checkPassword(str)
        {
            var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
            return re.test(str);
        }
        if(!checkPassword(password)) { return res.status(400).send({ status: false, msg: "password should contain at least 1 lowercase, uppercase ,numeric alphabetical character and at least one special character and also The string must be eight characters or longer" }) }        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/).test(password)) { return res.status(400).send({ status: false, msg: "password should contain at least 1 lowercase, uppercase ,numeric alphabetical character and at least one special character and also The string must be eight characters or longer" }) }
        
        if(!address){return res.status(400).send({status:false,message:"Please provide address"})}
        if(typeof address.street==='string' && address.street.trim().length === 0){return res.status(400).send({status:false,message:"street is empty"})}
        if(typeof address.street !== 'string') {return res.status(400).send({status:false,message:"street should be string"})}
       // if (!(/^\d+\s[A-z]+\s[A-z]$/).test(address.street)) return res.status(400).send({ status: false, message: " Please enter street as A-Z or a-z" })

        if(typeof address.city==='string' && address.city.trim().length === 0){return res.status(400).send({status:false,message:"city is empty"})}
        if(typeof address.city !== 'string') {return res.status(400).send({status:false,message:"city should be string"})}
        if (!(/^[a-zA-Z ]{2,30}$/).test(address.city)) return res.status(400).send({ status: false, message: " Please enter city as A-Z or a-z" })

        if(typeof address.pincode==='string' && address.pincode.trim().length === 0){return res.status(400).send({status:false,message:"pincode is empty"})}
        if(typeof address.pincode !== 'string') {return res.status(400).send({status:false,message:"pincode should be string"})}
        if (!(/^(\d{6})$/).test(address.pincode.trim())) { return res.status(400).send({ status: false, message: "Please provide valid pincode" }) }
       
        next()


    }
    catch(error){
         res.status(500).send({status:false,message:error})
    }
}

module.exports. uservalidation= uservalidation