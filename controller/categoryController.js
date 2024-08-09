const Category = require('../models/CategoryModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const slugify = require('slugify')






exports.addCategory = catchAsync(async(req,res)=>{
    const {name} = req.body

    const newCategory = await Category.create({
        name,
        slug:slugify(name)
    })

    res.status(200).json({
        status:"success",
        newCategory
    })
})

exports.getCategory = catchAsync(async(req,res)=>{
    const AllCategory = await Category.find()

    if(!AllCategory){
        return next(new AppError("No Category Found",400))
    }

    res.status(200).json({
        status:"success",
        AllCategory
    })
})




exports.getOneCategory = catchAsync(async(req,res,next)=>{

    const newCategory = await Category.findById(req.params.id).cache({key:req.params.id});
    
    if(!newCategory){
        return next(new AppError("No Category Found With This Id",400))
    }

    res.status(200).json({
        status:"success",
        newCategory
    })
})

exports.updateCategory = catchAsync(async(req,res,next)=>{
     
    
    const category = await Category.findByIdAndUpdate(req.params.id,req.body,{    
        new: true,
        runValidators: true
    })
    
    if(!category){
        return next(new AppError("No Category Found With This Id",400))
    }

    res.status(200).json({
        status:"success",
        msg:"Category Updated Successfully!!"
    })


})

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const categoryId = req.params.id;

        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            return next(new AppError("No Category Found With This Id", 400));
        }



        res.status(200).json({
            status: "success",
            msg: "Category Deleted Successfully!!"
        });
})
