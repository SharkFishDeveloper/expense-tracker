// require('dotenv').config({
// 	path: `.env.local`,
// })
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors');

// Create an instance of the express app
const app = express()
app.use(cors({
	origin:"*",
	credentials:true
}))
// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Use static middleware for frontend
app.use(express.static(path.join(__dirname, 'public')))

const pgRouter = require('./databases/postgres.js')
// const sequalizeRouter = require('./databases/sequalize.js')

app.use('/pg', pgRouter)
// app.use('/seq', sequalizeRouter)

// Start the server
const PORT =  4000;
app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`)
})

