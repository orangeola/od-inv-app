const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");


const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Sugar & Sweet Co. Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.category_list = function (req, res, next) {
  Category.find()
    .sort({ name: 1 })
    .exec(function (err, list_category) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("category_list", { title: "Category List", category_list: list_category });
    });
};

exports.category_detail = (req, res) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      //Success
      res.render("category_detail", {
        category_detail: results.category,
        category_items: results.category_items
      });
    }
  )
};

exports.category_create_get = (req, res) => {
  res.render("category_form", { title: "Create a Category" });
};

exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name required")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("description", "Description required")
  .trim()
  .isLength({ min: 1 })
  .escape(),


  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name, description: req.body.description });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create a Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }

        if (found_category) {
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];


exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
};

exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
};

exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update GET");
};

exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update POST");
};