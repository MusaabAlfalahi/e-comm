const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const BrandModel = require("../models/brandModel");

// @desc   Get list of brands
// @route  GET /api/v1/brands
// @access public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc   Get specific brand by id
// @route  GET /api/v1/brands/:id
// @access public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id: ${id}`, 404));
  } 
    res.status(200).json({ data: brand });
  
});

// @desc   Create brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const {name} = req.body;

  const brand = await BrandModel.create({
    name: name,
    slug: slugify(name),
  });
  res.status(201).json({ data: brand });
});

// @desc   Update brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } //will return the brand after update //false => before
  );

  if (!brand) {
    return next(new ApiError(`No brand for this id: ${id}`, 404));
  } 
    res.status(200).json({ data: brand });
  
});

// @desc   Delete brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findByIdAndDelete(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id: ${id}`, 404));
  } 
    res.status(204).send();
  
});
