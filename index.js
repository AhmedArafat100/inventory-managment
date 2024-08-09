const express = require('express');
const mongoose = require('mongoose');
const Email = require("./utils/Email")
const authRouter = require('./router/authRouter')
const ProductRouter = require('./router/productRouter')
const CategoryRouter = require('./router/CategoryRouter')
const path = require('path')
require('dotenv').config()

const app = express();

app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))



// MongoDB connection
mongoose
.connect(process.env.MONGO_URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true
 })
 .then(() => console.log('DB connection successful!'));


app.use('/api/v1/product',ProductRouter)
app.use('/api/v1/category',CategoryRouter)
app.use('/api/v1/auth',authRouter)




const emailService = new Email();


// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


