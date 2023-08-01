const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const SubCategoryModel = require("../models/subCategoryModel");

// @desc   Create subCategory
// @route  POST /api/v1/subcategories
// @access Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.create({
    name: name,
    slug: slugify(name),
    category: category,
  });
  res.status(201).json({ data: subCategory });
});

// GET /api/v1/subcategories/:categoryId/subCategories

// @desc   Get list of subCategories
// @route  GET /api/v1/subcategories
// @access public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  console.log(req.params.categoryId);

  const subCategories = await SubCategoryModel.find({}).skip(skip).limit(limit);
  // .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @desc   Get specific subCategory by id
// @route  GET /api/v1/subcategories/:id
// @access public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id);
  // .populate({
  //   path: "category",
  //   select: "name -_id",
  // });
  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id: ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc   Update subCategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true } //will return the category after update //false => before
  );

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id: ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc   Delete subCategory
// @route  DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id: ${id}`, 404));
  }
  res.status(204).send();
});
