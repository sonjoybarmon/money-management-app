const Transaction = require('../modal/Transaction')
const User = require('../modal/User')
const { serverError } = require('../util/error')


module.exports = {
    create(req , res) {
        let { amount , note , type } = req.body
        let userId = req.user._id 

        let transaction = new Transaction({ 
            amount, 
            note , 
            type , 
            author : userId
        })

        transaction.save()
        .then(trans => {
            let updatedUser = {...req.user._doc}
            if(type === 'income') {
                updatedUser.balance = updatedUser.balance + amount
                updatedUser.income = updatedUser.income + amount
            }else if(type === 'expense') {
                updatedUser.balance = updatedUser.balance - amount
                updatedUser.income = updatedUser.income + amount
            }
            // console.log(updatedUser);
            updatedUser.transactions.unshift(trans._id)

            User.findByIdAndUpdate(updatedUser._id , { $set : updatedUser}, {new : true})
                .then(result => {
                    res.status(201).json({
                        message : 'Transaction Created Successfully',
                        ...trans._doc,
                        user : result
                    })
                })
                .catch(error => serverError(res , error))
            
        })
        .catch(error => serverError(res , error))
    },
    
    //get all transactions from mongodb
    getAll(req , res) {
        Transaction.find()
        .then(transaction => {
            if (transaction.length === 0) {
                 res.status(200).json({ 
                message: 'no transaction found'
                })
            }else {
                res.status(200).json(transaction)
            }
           
        })
        .catch(error => serverError(res , error))
    },

    //single transaction get korar jonno
    getSingleTransaction(req, res) {
        let { transactionId} = req.params
        transaction.findById(transactionId)
        .then(transaction => {
            if(!transaction){
                res.status(404).json({
                    message : 'Transaction not found'
                })
            }else {
                res.status(200).json(transaction)
            }
        })
        .catch(error => serverError(res , error))
    },

    //update a transaction data

    update(req, res) {
        let { transactionId} = req.params
        User.findByIdAndUpdate(transactionId , {$set : req.body})
        .then(result => {
            res.status(400).json({
                message : 'updated successfully',
                ...result
            })
        })
        .catch(error => serverError(res , error))
    },

    //delete a transaction data 

    remove(req, res) {
        let { transactionId } = req.params
        User.findByIdAndDelete(transactionId)
        .then(result => {
            res.status(200).json({
                message : 'deleted successfully',
                ...result
            })
        })
        .catch(error => serverError(res , error))
    }


}
    