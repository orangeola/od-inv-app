const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");


const async = require("async");
const category = require("../models/category");

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

exports.category_detail = (req, res, next) => {
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
  async.parallel({
    items(callback){
      Item.find({category: req.params.id}).exec(callback);
    },
    category(callback){
      Category.findById({_id: req.params.id}).exec(callback);
    }
  },
  (err, results) => {
    if (err) {
      return next(err);
    }
    if (results.category == null) {
      res.redirect("/catalog/category");
    }
    //Success
    res.render("category_delete", {
      title: "Delete Category",
      category: results.category,
      category_items: results.items
    });
  })
};

exports.category_delete_post = (req, res, next) => {
  async.parallel({
    items(callback){
      Item.find({category: req.params.id}).exec(callback);
    },
    category(callback){
      Category.findById({_id: req.params.id}).exec(callback);
    }
  },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.items.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render("category_delete", {
          title: "Delete Category",
          category: results.category,
          category_items: results.items
        });
        return;
      }
      // Delete object.
      Category.findByIdAndRemove(req.body.categoryid, (err) => {
        if (err) {
          return next(err);
        }
        // Success
        res.redirect("/catalog/category");
      });
    }
  );
};


exports.category_update_get = (req, res) => {
  Category.findById({_id: req.params.id})
  .exec(function (err, category) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("category_form", { title: "Category List", category: category });
    });
};

exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update POST");
};

exports.category_update_post = [
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
    const category = new Category({ 
      name: req.body.name, 
      description: req.body.description, 
      _id: req.params.id
    });

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
          // Data from form is valid. Update the record.
          Category.findByIdAndUpdate(req.params.id, category, {}, (err, thecategory) => {
          if (err) {
            return next(err);
          }

          // Successful: redirect to book detail page.
          res.redirect(thecategory.url);});
        }
      });
    }
  },
];