const express =require('express')
const categoryController = require("../controller/categoryController")
const authController = require("../controller/authController")
const router = express.Router()
const clearCache = require('../middleware/clearCache')



router.route('/')
.post(
    authController.protect
    ,authController.restrictTo("admin","manager")
    ,categoryController.addCategory)
.get(categoryController.getCategory)


router.route('/:id')
.get(categoryController.getOneCategory)
.delete(clearCache
    ,authController.protect
    ,authController.restrictTo("admin","manager")
    ,categoryController.deleteCategory)
.put(clearCache
    ,authController.protect
    ,authController.restrictTo("admin","manager")
    ,categoryController.updateCategory)


module.exports=router