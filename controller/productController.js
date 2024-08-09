const Product = require('../models/productmodel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const multer = require('multer')
const {clearHash} = require('../utils/cache')

const diskStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${Date.now()}.${ext}`
        cb(null,fileName)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
  };


const upload = multer({
    storage :diskStorage,
    fileFilter:multerFilter
})

exports.uploadProductPhoto=upload.single('photo')





exports.addProduct = catchAsync(async(req,res)=>{
    const{name,quantity,expirationDate,category} = req.body

    const newProduct = await Product.create({
        name,
        quantity,
        expirationDate,
        photo: req.file.filename,
        category
    })

    res.status(200).json({
        status:"success",
        newProduct
    })
})

exports.getProduct = catchAsync(async(req,res)=>{

    const products = await Product.find()
    .sort({createdAt:-1})
    .populate("category")
    
    if(!products){
        return next(new AppError("No Product Found",400))
    }

    res.status(200).json({
        status:"success",
        products
    })
})




exports.getOneProduct = catchAsync(async(req,res,next)=>{

    const product = await Product.findById(req.params.id)
    .cache({key:req.params.id})
    .populate("category");
    
    if(!product){
        return next(new AppError("No Product Found With This Id",400))
    }

    res.status(200).json({
        status:"success",
        product
    })
})

exports.updateProduct = catchAsync(async(req,res,next)=>{
     
    
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{    
        new: true,
        runValidators: true
    })
    
    if(!product){
        return next(new AppError("No Product Found With This Id",400))
    }

    res.status(200).json({
        status:"success",
        msg:"Product Updated Successfully!!"
    })


})

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const productId = req.params.id;

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return next(new AppError("No Product Found With This Id", 400));
        }



        res.status(200).json({
            status: "success",
            msg: "Product Deleted Successfully!!"
        });
})
