const registerValidator = require('../validator/registerValidator')
const loginValidator = require('../validator/loginValidator')
const bcrypt = require('bcrypt')
const User = require('../modal/User')
const {serverError , resourcedError} = require('../util/error')
var jwt = require('jsonwebtoken');

module.exports = {
    login(req, res) {
       let {email , password} = req.body
       let validator = loginValidator({email, password})

       if(!validator.isValid){
           return res.status(400).json(validator.error)
       }

       //check email
       User.findOne({email})
       .then(user => {
           //without match user 
            if(!user){
                resourcedError(res , 'User not found')
            }
            //user jodi hoy
            bcrypt.compare(password , user.password , (err , result) => {
                if(err){
                    return serverError(ers , err)
                }
                if(!result){
                    resourcedError(res , 'Password doesn\'t match')
                }

                //user login and check
                let token = jwt.sign({
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    amount : user.amount,
                    income : user.income ,
                    expires : user.expires,
                    transactions : user.transactions
                    
                },'SECRET', {expiresIn : '2h'})

                res.status(200).json({
                    message : 'Login successful',
                    token : `Bearer ${token}`
                })

            })
       })
       //without match email 
       .catch(err => serverError(res , err))
    },


    register (req, res) {
        let {name , email , password , confirmPassword} = req.body
        let validate = registerValidator({name , email , password , confirmPassword})

        if(!validate.isValid) {
            res.status(400).json(validate.error)
        }else{
        //check duplicate email
            User.findOne({ email})
            .then(user => {
                if(user){
                    return resourcedError(res , 'Email Already Exist')
                    // return res.status(400).json({ 
                    //     message: 'Email Already Exist'
                    // })
                }

                //hash password use bcrypt
                bcrypt.hash(password , 11 , (err, hash) => {
                    if(err){
                        return res.status(500).json({ 
                            message: 'Internal server error'
                        })
                    }

                    //create user
                    let user = new User({
                        name ,
                        email ,
                        password : hash,
                        balance : 0,
                        expense : 0 ,
                        income : 0,
                        transactions : [],
                    })
                    // res.json(user)

                    //user save 
                    user.save()
                    .then(user => {
                        res.status(201).json({
                            message : 'User Created Successfully',
                            user
                        })
                    })
                    .catch(err => serverError(res , err)
                    // {
                    //     console.log(err);
                    //     res.status(500).json({
                    //         message : "Server Error Occurred",
                    //     })
                    // }
                    )
                })

            })
            .catch(err => serverError(res , err)
                // {
                //     console.log(err);
                //     res.status(500).json({
                //         message : "Server Error Occurred",
                //     })
                // }
            )


            // res.status(200).json({
            //     message : 'Registration successful'
            // })
        }
    },
    allUsers(req, res) {
        User.find()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => serverError(res, error))
    }
}