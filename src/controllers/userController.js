
const userModel= require("../Models/userModel")
const jwt=require("jsonwebtoken")




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

let loginUser= async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (!email) return res.status(400).send({ status: false, msg: 'email is Required' });
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(email.trim())) { return res.status(400).send({ status: false, message: "Please provide valid email" }) }

        if (!password) return res.status(400).send({ status: false, msg: ' password is Required' })
        function checkPassword(str)
        {
            var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
            return re.test(str);
        }
        if(!checkPassword(password)) { return res.status(400).send({ status: false, msg: "password should contain at least 1 lowercase, uppercase ,numeric alphabetical character and at least one special character and also The string must be eight characters or longer" }) }        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/).test(password)) { return res.status(400).send({ status: false, msg: "password should contain at least 1 lowercase, uppercase ,numeric alphabetical character and at least one special character and also The string must be eight characters or longer" }) }
        


        let User = await userModel.findOne({ email: email, password: password });
        if (!User) return res.status(400).send({
            status: false, msg: "email or the password is not correct",
        });

        let token = jwt.sign(
            {
                userId:User._id.toString(),
                project: 1,
                group: "group-60",
            },
            "functionUp-project3"
        );
        console.log(token);
        res.status(201).send({ status: true, data: { token } });
    } catch (err) {
        res.status(500).send({ msg: "Error", msg: err.message })
    }
};

module.exports={createUser,loginUser}