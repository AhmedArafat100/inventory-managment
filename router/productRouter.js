const express =require('express')
const productController = require("../controller/productController")
const authController = require("../controller/authController")
const router = express.Router()
const clearCache = require('../middleware/clearCache')



router.route('/')
.post(productController.uploadProductPhoto
    ,authController.protect
    ,authController.restrictTo("admin","manager")
    ,productController.addProduct)
.get(productController.getProduct)


router.route('/:id')
.get(productController.getOneProduct)
.delete(clearCache
    ,authController.protect
    ,authController.restrictTo("admin","manager")
    ,productController.deleteProduct)
.put(clearCache
    ,authController.protect
    ,authController.restrictTo("admin","manager")
    ,productController.updateProduct)


module.exports=router