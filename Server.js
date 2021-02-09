const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(passport.initialize())
require('./passport')(passport)




app.use('/api/users', require('./routers/userRoute'))
app.use('/api/transactions', require('./routers/transactionRoute'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const PORT = process.env.PORT || 4000
app.listen(PORT , () => {
  console.log(`SERVER is RUNNING ON PORT ${PORT}`)
  mongoose.connect(`mongodb+srv://nodeMongoose:nodeMongoose@cluster0.5trbi.mongodb.net/nodeMongoose?retryWrites=true&w=majority`,
        {  useNewUrlParser: true,
          useFindAndModify: true,
          useCreateIndex: true ,
          useUnifiedTopology: true },
        () => {
        console.log('Database Connected...')
    });
})