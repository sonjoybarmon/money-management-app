const { json } = require('body-parser')
const router = require('express').Router()
const {login , register , allUsers} = require('../controller/userController')

router.post('/register' , register )

router.post('/login', login )
router.get('/users' , allUsers)
module.exports = router