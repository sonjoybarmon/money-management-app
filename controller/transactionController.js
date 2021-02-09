const Transaction = require('../modal/Transaction')
const User = require('../modal/User')
const { serverError } = require('../util/error')

module.exports = {
    create(req, res, next) {
        let { amount, note, type } = req.body
        let userId = req.user._id

        let transaction = new Transaction({
            amount, note, type, author: userId
        })

        transaction.save()
            .then(trans => {
                let updatedUser = { ...req.user._doc }
                if (type === 'income') {
                    updatedUser.balance = updatedUser.balance + amount
                    updatedUser.income = updatedUser.income + amount
                } else if (type === 'expense') {
                    updatedUser.balance = updatedUser.balance - amount
                    updatedUser.expense = updatedUser.expense + amount
                }
                updatedUser.transactions.unshift(trans._id)
                
                User.findByIdAndUpdate(updatedUser._id, { $set: updatedUser }, { new: true })
                    .then(result => {
                        res.status(201).json({
                            message: 'Transaction Created Successfully',
                            ...trans._doc,
                            user: result
                        })
                    })
                    .catch(error => serverError(res, error))
                
            })
            .catch(error => serverError(res, error))
    },
    getAll(req, res) {
        let {_id} = req.user
        console.log(req.user);
        Transaction.find({author: _id})
            .then(transactions => {
                if (transactions.length === 0) {
                    res.status(200).json({
                        message: 'No Transaction Found'
                    })
                } else {
                    res.status(200).json(transactions)
                }
            })
            .catch(error => serverError(res, error))
    },
    getSingleTransaction(req, res) {
        let { transactionId } = req.params
        Transaction.findById(transactionId)
            .then(transaction => {
                if (!transaction) {
                    res.status(200).json({
                        message: 'No Transaction Found'
                    })
                } else {
                    res.status(200).json(transaction)
                }
            })
            .catch(error => serverError(res, error))
    },
    update(req, res) {
        let { transactionId } = req.params
        Transaction.findOneAndUpdate({ _id: transactionId }, { $set: req.body }, {new: true})
            .then(result => { 
                res.status(200).json({
                    message: 'Updated Successfully',
                    transaction: result
                })
            })
            .catch(error => serverError(res, error))
    },
    remove(req, res) {
        let { transactionId } = req.params
        Transaction.findOneAndDelete({ _id: transactionId })
            .then(result => {
                res.status(200).json({
                    message: 'Deleted Successfully',
                    ...result._doc
                })
            })
            .catch(error => serverError(res, error))
    }
}


// const Transaction = require('../modal/Transaction')
// const User = require('../modal/User')
// const { serverError } = require('../util/error')


// module.exports = {
//     create(req , res) {
//         let { amount , note , type } = req.body
//         let userId = req.user._id 

//         let transaction = new Transaction({ 
//             amount, 
//             note , 
//             type , 
//             author : userId
//         })

//         transaction.save()
//         .then(trans => {
//             let updatedUser = { ...req.user._doc }
//                 if (type === 'income') {
//                     updatedUser.balance = updatedUser.balance + amount
//                     updatedUser.income = updatedUser.income + amount
//                 } else if (type === 'expense') {
//                     updatedUser.balance = updatedUser.balance - amount
//                     updatedUser.expense = updatedUser.expense + amount
//                 }
//                 updatedUser.transactions.unshift(trans._id)

//             User.findByIdAndUpdate(updatedUser._id , { $set : updatedUser}, {new : true})
//                 .then(result => {
//                     res.status(201).json({
//                         message : 'Transaction Created Successfully',
//                         ...trans._doc,
//                         user : result
//                     })
//                 })
//                 .catch(error => serverError(res , error))
            
//         })
//         .catch(error => serverError(res , error))
//     },
    
//     //get all transactions from mongodb
//     getAll(req, res) {
//         let {_id} = req.user
//         Transaction.find({author: _id})
//             .then(transactions => {
//                 if (transactions.length === 0) {
//                     res.status(200).json({
//                         message: 'No Transaction Found'
//                     })
//                 } else {
//                     res.status(200).json(transactions)
//                 }
//             })
//             .catch(error => serverError(res, error))
//     },

//     //single transaction get korar jonno
//     getSingleTransaction(req, res) {
//         let { transactionId} = req.params
//         transaction.findById(transactionId)
//         .then(transaction => {
//             if(!transaction){
//                 res.status(404).json({
//                     message : 'Transaction not found'
//                 })
//             }else {
//                 res.status(200).json(transaction)
//             }
//         })
//         .catch(error => serverError(res , error))
//     },

//     //update a transaction data

//     update(req, res) {
//         let { transactionId} = req.params
//         User.findByIdAndUpdate(transactionId , {$set : req.body})
//         .then(result => {
//             res.status(400).json({
//                 message : 'updated successfully',
//                 ...result
//             })
//         })
//         .catch(error => serverError(res , error))
//     },

//     //delete a transaction data 

//     remove(req, res) {
//         let { transactionId } = req.params
//         User.findByIdAndDelete(transactionId)
//         .then(result => {
//             res.status(200).json({
//                 message : 'deleted successfully',
//                 ...result
//             })
//         })
//         .catch(error => serverError(res , error))
//     }


// }
    