const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const CategoryModel = require("../models/categoryModel");

// @desc   Get list of categories
// @route  GET /api/v1/categories
// @access public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc   Get specific category by id
// @route  GET /api/v1/categories/:id
// @access public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`No category for this id: ${id}`, 404));
  } 
    res.status(200).json({ data: category });
  
});

// @desc   Create category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const {name} = req.body;

  const category = await CategoryModel.create({
    name: name,
    slug: slugify(name),
  });
  res.status(201).json({ data: category });
});

// @desc   Update category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } //will return the category after update //false => before
  );

  if (!category) {
    return next(new ApiError(`No category for this id: ${id}`, 404));
  } 
    res.status(200).json({ data: category });
  
});

// @desc   Delete category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category for this id: ${id}`, 404));
  } 
    res.status(204).send();
  
});
