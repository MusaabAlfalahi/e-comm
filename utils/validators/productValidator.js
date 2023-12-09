const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title is required")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters"),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product sold must be a number")
    .isLength({ max: 20 })
    .withMessage("Too long price"),
  check("price")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product sold must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than product price");
      }
      return true;
    }),
  check("availableColors")
    .optional()
    .isArray()
    .withMessage("availableColors should be an array of string"),
  check("imageCover").notEmpty().withMessage("product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be an array of string"),
  check("category")
    .notEmpty()
    .withMessage("product category is required")
    .isMongoId()
    .withMessage("Invalid ID"),
  check("subCategory").optional().isMongoId().withMessage("Invalid ID"),
  check("brand").optional().isMongoId().withMessage("Invalid ID"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Ratings must be above or equal to 1.0")
    .isLength({ max: 5 })
    .withMessage("Ratings must be below or equal to 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];
